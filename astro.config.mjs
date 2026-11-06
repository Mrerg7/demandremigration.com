import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://demandremigration.com",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
});
