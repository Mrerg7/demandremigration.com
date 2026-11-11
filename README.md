> [!CAUTION]
> **This repository is NOT the deploy source.**
> Cloudflare Workers Builds deploys from **[`Mrerg7/demandremigration-com`](https://github.com/Mrerg7/demandremigration-com)**.
> Do not push here. Use that repo instead. This copy is a duplicate and can be deleted.

# DEPRECATED — demandremigration.com

**Wrong repo.** Use https://github.com/Mrerg7/demandremigration-com

Sister site to [demandremigration.com](https://demandremigration.com/), [demandingremigration.com](https://demandingremigration.com/), [nozabiha.com](https://nozabiha.com/), [nozabihahalal.com](https://nozabihahalal.com/), [islamophobe.me](https://islamophobe.me/), and [industrialterrorism.com](https://industrialterrorism.com/).

Static Astro site on Cloudflare Workers static assets. Free plan. Not deployed until you run the deploy script.

## Deploy

Deploy from **`demandremigration-com`**, not this repository.

```bash
# correct repo
git clone https://github.com/Mrerg7/demandremigration-com.git
cd demandremigration-com
npm install
npm run deploy
```

Then attach the custom domain `demandremigration.com` to the worker `demandremigration-com`.
