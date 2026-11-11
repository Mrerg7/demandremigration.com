interface Env {
  ASSETS: Fetcher;
}

const CANONICAL_ORIGIN = "https://demandremigration.com";
const CANONICAL_HOST = "demandremigration.com";
const NOT_FOUND_PATHS = new Set(["/404", "/404/", "/404.html"]);

/** Root and nested /index(.html) aliases Assets can soft-serve as duplicate HTML. */
const INDEX_HTML_SUFFIX = /\/index\.html\/?$/i;
const INDEX_ALIAS_SUFFIX = /\/index\/?$/i;

function collapseIndexAliases(pathname: string): string {
  let path = pathname.replace(/\/{2,}/g, "/") || "/";
  if (INDEX_HTML_SUFFIX.test(path)) {
    path = path.replace(INDEX_HTML_SUFFIX, "/");
  }
  // /index and /index/ soft-serve index.html under force-trailing-slash —
  // collapse them so GSC does not see duplicate URLs without a chosen canonical.
  if (INDEX_ALIAS_SUFFIX.test(path)) {
    path = path.replace(INDEX_ALIAS_SUFFIX, "/");
  }
  if (path.length === 0) path = "/";
  return path;
}

function getCanonicalRedirect(request: Request): string | null {
  const url = new URL(request.url);
  const hostname = url.hostname.toLowerCase();
  const isSiteHost = hostname === CANONICAL_HOST || hostname === `www.${CANONICAL_HOST}`;
  const canonical = new URL(url.pathname + url.search, isSiteHost ? CANONICAL_ORIGIN : url.origin);
  let needsRedirect = false;

  if (isSiteHost && (url.protocol === "http:" || hostname === `www.${CANONICAL_HOST}`)) {
    needsRedirect = true;
  }

  const beforeIndex = canonical.pathname;
  canonical.pathname = collapseIndexAliases(beforeIndex);
  if (canonical.pathname !== beforeIndex) {
    needsRedirect = true;
  }

  if (
    !NOT_FOUND_PATHS.has(canonical.pathname) &&
    canonical.pathname !== "/" &&
    !canonical.pathname.endsWith("/") &&
    !/\.\w+$/.test(canonical.pathname)
  ) {
    canonical.pathname += "/";
    needsRedirect = true;
  }

  // Drop a bare "?" so /? is not treated as a distinct URL.
  if (url.href.endsWith("?") && canonical.searchParams.toString() === "") {
    canonical.search = "";
    needsRedirect = true;
  }

  return needsRedirect ? canonical.toString() : null;
}

async function notFoundResponse(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const assetResponse = await env.ASSETS.fetch(new Request(new URL("/404.html", url.origin), request));
  return new Response(assetResponse.body, {
    status: 404,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex",
      "Cache-Control": "no-store",
    },
  });
}

function withCanonicalLink(response: Response, request: Request): Response {
  if (response.status !== 200) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) return response;

  const url = new URL(request.url);
  const headers = new Headers(response.headers);
  const canonicalPath = url.pathname === "/" ? "/" : url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  headers.set("Link", `<${CANONICAL_ORIGIN}${canonicalPath}>; rel="canonical"`);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (NOT_FOUND_PATHS.has(url.pathname)) return notFoundResponse(request, env);
    const redirectUrl = getCanonicalRedirect(request);
    if (redirectUrl) return Response.redirect(redirectUrl, 301);

    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status === 404) return notFoundResponse(request, env);
    return withCanonicalLink(assetResponse, request);
  },
} satisfies ExportedHandler<Env>;
