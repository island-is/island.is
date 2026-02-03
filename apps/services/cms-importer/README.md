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

## Architecture

- **main.ts** - Entry point that handles job routing based on command-line arguments
- **app/grant-import/** - Grant import module with service and worker logic
- **app/energy-fund-import/** - Energy fund import module
- **app/fsre-buildings-import/** - FSRE buildings import module
- **app/repositories/** - Data access layer for CMS, grants, and energy grants

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
