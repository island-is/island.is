# CMS Importer

Worker service for importing organization data into Contentful and running CMS
maintenance jobs. Set `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN` before running jobs.

## Development

Run commands from the repository root:

```bash
yarn nx build services-cms-importer
yarn nx test services-cms-importer
yarn nx lint services-cms-importer
```

Each job has an Nx target. To pass job-specific flags directly, use the built
entry point:

```bash
node dist/apps/services/cms-importer/main.cjs --job <job> [flags]
```

## Importers and maintenance

| Area                    | Documentation                                                                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Grants                  | [Rannís grant import](src/app/grants/README.md)                                                                                               |
| Energy fund             | [Orkustofnun import](src/app/organizations/energy-fund/README.md)                                                                             |
| FSRE                    | [Building import](src/app/organizations/fsre-buildings/README.md)                                                                             |
| Lyfjastofnun (disabled) | [Instructions, lists and forms](src/app/organizations/lyfjastofnun/README.md), [news](src/app/organizations/lyfjastofnun/jobs/news/README.md) |
| RSK (disabled)          | [Double taxation treaties](src/app/organizations/rsk/README.md)                                                                               |
| Contentful maintenance  | [Sitemap and cleanup jobs](src/app/contentful-maintenance/README.md)                                                                          |

Lyfjastofnun and RSK imports are disabled pending testing and have no runnable
CLI routes or Nx targets.

## Structure

`src/main.ts` routes jobs. `src/app/platform/` provides shared Contentful access,
sync strategies, localization and mappers. Organization-specific jobs live under
`src/app/organizations/<organization>/jobs/`; grants and maintenance jobs have
their own directories under `src/app/`.
