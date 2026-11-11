# demandremigration.com

Sister site to [demandremigration.com](https://demandremigration.com/), [demandingremigration.com](https://demandingremigration.com/), [nozabiha.com](https://nozabiha.com/), [nozabihahalal.com](https://nozabihahalal.com/), [islamophobe.me](https://islamophobe.me/), and [industrialterrorism.com](https://industrialterrorism.com/).

Static Astro site on Cloudflare Workers static assets. Free plan. Not deployed until you run the deploy script.

## Deploy

```bash
npm install
npm run deploy
```

Then attach the custom domain `demandremigration.com` to the worker `demandremigration-com`. If that worker name is already taken on the account, rename it in wrangler.toml before the first deploy.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

`www.demandremigration.com` and `http` on the apex redirect to `https://demandremigration.com/`. `/index`, `/index/`, and `/index.html` also 301 to `/` so Cloudflare Assets cannot soft-serve a duplicate homepage (Search Console: “Duplicate without user-selected canonical”). HTML responses also send a `Link: rel=canonical` header. workers.dev previews are left alone for host redirects.
