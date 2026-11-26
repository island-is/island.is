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

### AD Staff Import

Syncs an organization's staff list (`teamList` + `teamMember` entries) from its Entra ID, read-only through Microsoft Graph. The organizations are listed in `app/ad-staff-import/constants.ts`.

- Reads the members of one Entra ID group, so the organization decides who is shown on the website.
- Entries get the id `adstaff-<key>-<Entra ID object id>`, so a person is matched without extra fields in Contentful.
- Only name, job title, email, work phone and department (filter tag) are synced. Fields editors add in Contentful, such as the intro, are kept.
- New people get their Entra ID photo, or the organization's placeholder image when there is none.
- People who leave the group are removed from the list and archived, never deleted. A run that would remove more than half of the synced members is stopped.
- Entries with unpublished changes in Contentful are skipped.
- It is a dry run unless `AD_STAFF_IMPORT_DRY_RUN=false`: the plan is logged and nothing is written.

Each organization needs an app registration in its Entra ID with the application permissions `User.Read.All` and `GroupMember.Read.All`, and these env variables (`<KEY>` is the upper-case source key, e.g. `RGR`):

- `AD_STAFF_IMPORT_<KEY>_TENANT_ID`
- `AD_STAFF_IMPORT_<KEY>_CLIENT_ID`
- `AD_STAFF_IMPORT_<KEY>_CLIENT_SECRET`
- `AD_STAFF_IMPORT_<KEY>_GROUP_ID`

Organizations without these variables are skipped.

```bash
yarn nx run services-cms-importer:ad-staff-import
```

## Architecture

- **main.ts** - Entry point that handles job routing based on command-line arguments
- **app/grant-import/** - Grant import module with service and worker logic
- **app/energy-fund-import/** - Energy fund import module
- **app/fsre-buildings-import/** - FSRE buildings import module
- **app/cms-cleanup/** - CMS cleanup module
- **app/ad-staff-import/** - AD staff import module
- **app/repositories/** - Data access layer for CMS, grants, energy grants and Microsoft Graph

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
nx ad-staff-import services-cms-importer
```

Or run the built application directly with job arguments:

```bash
yarn nx dist/apps/services/cms-importer/main.js --job grant-import
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
