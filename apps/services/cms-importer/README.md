# CMS Importer

The CMS Importer is a service dedicated to importing data from various organizations and importing into the CMS. This service runs as a worker application supporting multiple import jobs, which have scheduling options.

## Overview

The CMS Importer handles batch import operations for different data sources, transforming and syncing them with the CMS. Each import job is a standalone worker that can be triggered independently.

## Supported Jobs

### Grant Import

Imports grants from Rannís, and creates/updates a collection of Grant Items in the CMS.

```bash
yarn nx run services-cms-importer:grant-import
```

### Energy Fund Import

Imports energy fund data from Orkustofnun, and creates/updates a collection in the CMS of generic list items linked to a single generic list.

```bash
yarn nx run services-cms-importer:energy-fund-import
```

### FSRE Buildings Import

Imports building data from FSRE, and creates/updates in the CMS a collection of generic list items linked to a single generic list.

```bash
yarn nx run services-cms-importer:fsre-buildings-import
```

### Lyfjastofnun Imports

Four jobs importing published material from lyfjastofnun.is into the CMS. The
guidelines, lists and forms jobs each scrape a static WordPress page and create
generic list items linked to a single generic list; the news job reads the
WordPress REST API instead. Where the Icelandic page links a document, the file
is uploaded as a Contentful asset; where it links elsewhere, a `linkUrl` entry is
created. English titles come from the corresponding page on ima.is.

All four create entries as drafts — pass `--publish` only when you intend the
created entries to go live immediately.

```bash
yarn nx run services-cms-importer:lyfjastofnun-instructions-import
yarn nx run services-cms-importer:lyfjastofnun-lists-import
yarn nx run services-cms-importer:lyfjastofnun-forms-import
yarn nx run services-cms-importer:lyfjastofnun-news-import
```

#### Flags

The nx targets already pass `--job`, so extra flags are easiest to add by
running the built entry point directly:

```bash
yarn nx build services-cms-importer
node dist/apps/services/cms-importer/main.cjs --job <job> [flags]
```

| Flag            | Jobs | Meaning                                                                                                       |
| --------------- | ---- | ------------------------------------------------------------------------------------------------------------- |
| `--publish`     | all  | publish created entries and assets instead of leaving drafts                                                  |
| `--limit <n>`   | all  | maximum number of _new_ entries to create (applied after existing ones are filtered out). News defaults to 10 |
| `--months <n>`  | news | how far back to fetch posts. Defaults to 12                                                                   |
| `--slug <slug>` | news | import only this post, ignoring `--limit`                                                                     |

`--limit` and `--months` must be positive integers; anything else is warned
about and the default is used.

A historical news backfill therefore looks like:

```bash
node dist/apps/services/cms-importer/main.cjs \
  --job lyfjastofnun-news-import --months 36 --limit 500
```

Posts with no image of their own are given one from a fixed set of seed images
(see `SEED_IMAGE_ASSET_IDS`), since the `news` content type requires an image
and most lyfjastofnun.is posts have none. **Those seed assets must be published
in Contentful before any article referencing them is published**, otherwise the
articles render with no image.

### Web Sitemap

Generates a sitemap.xml file in S3 (that gets forwarded to https://island.is/sitemap.xml) by fetching entries from the CMS

```bash
yarn nx run services-cms-importer:web-sitemap
```

### CMS Cleanup

Runs CMS cleanup tasks. Initial scaffold is intended for cleanup jobs like deleting duplicate assets in other Contentful environments.

```bash
yarn nx run services-cms-importer:cms-cleanup
```

## Architecture

- **main.ts** - Entry point that handles job routing based on command-line arguments
- **app/platform/** - Shared data access layer: Contentful management client, CMS repository, sync strategies and content-type mappers
- **app/grants/jobs/** - Grant import module with service and worker logic
- **app/organizations/energy-fund/jobs/** - Energy fund import module
- **app/organizations/fsre-buildings/jobs/** - FSRE buildings import module
- **app/organizations/lyfjastofnun/** - Shared lyfjastofnun.is scraper/repository, with one module per job under `jobs/`
- **app/contentful-maintenance/jobs/** - Web sitemap and CMS cleanup modules

## Building

Build the application:

```bash
nx build services-cms-importer
```

## Running Jobs

Each job can be run individually using the corresponding Nx target:

```bash
nx grant-import services-cms-importer
nx energy-fund-import services-cms-importer
nx fsre-buildings-import services-cms-importer
nx cms-cleanup services-cms-importer
```

Or run the built application directly with job arguments:

```bash
node dist/apps/services/cms-importer/main.cjs --job grant-import
```

## Testing

Run tests for the cms-importer service:

```bash
nx test services-cms-importer
```

## Linting

Check code style:

```bash
nx lint services-cms-importer
```

## Configuration

Each import job may require specific environment variables for connecting to CMS, databases, and external services. Refer to individual job module documentation for configuration details.

You must have the CONTENTFUL_MANAGEMENT_ACCESS_TOKEN environment variable set.
