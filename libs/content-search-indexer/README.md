````ts
# Content Search Indexer

This library aggregates importers from multiple projects for importing data into Elasticsearch, used by the content search engine.

## Creating an Importer

### Quick Start

1. Create an importer NestJS service and export it via a NestJS module.
2. Add the module in `indexing.module.ts`.
3. Add the service in `indexing.service.ts`.

Data should import when calling `/sync` or `/re-sync`.

### Overview

- Types are provided by `@island.is/content-search-indexer/types`.
- An importer service must export `doSync`.
- `SyncOptions` is the parameter for `doSync`.
- `doSync` returns `SyncResponse` or `null`.
- Optionally, export `postSync` for post-import actions.
- `postSync` receives `postSyncOptions` from `SyncResponse`.

Example:

```ts
// myCustomImporter.service.ts
import {
  ContentSearchImporter,
  SyncOptions,
  SyncResponse,
} from '@island.is/content-search-indexer/types'

export class MyCustomImporterService implements ContentSearchImporter {
  doSync(options: SyncOptions): Promise<SyncResponse | null> {
    // External requests and data mapping

    if (!needToSync) {
      return null
    }

    return {
      add: [], // Data to import (MappedData[])
      remove: [], // Elasticsearch IDs to remove (string[])
    }
  }
}

// myCustomImporter.module.ts
import { Module } from '@nestjs/common'
import { MyCustomImporterService } from './myCustomImporter.service.ts'

@Module({
  providers: [MyCustomImporterService],
  exports: [MyCustomImporterService],
})
export class MyCustomImporterModule {}
````

## Importing Data

Return `MappedData` in `SyncResponse.add`. Support three import types (`SyncOptions.syncType`):

- **full**: Triggered by `/re-sync`. Imports all data. Used when the index is out of sync or contains stale data. Removes all documents not returned by this sync.
- **fromLast**: Triggered by `/sync`. Imports new/updated data since last sync.
- **initialize**: Triggered by container deployment. Validates changes and initiates a full sync if needed.

Unsupported locales should return an empty `SyncResponse`. Access the index name via **SyncOptions.elasticIndex** if needed.

## Post Sync (Optional)

`postSync` runs after data import to handle post-import tasks such as cleanup or maintaining tokens. It receives `postSyncOptions` from `SyncResponse`.

## Error Handling

Ensure importers are resilient to non-critical errors, e.g., missing entry titles. Critical issues like data source connectivity should throw errors to halt importers. This ensures robust index population during app deployment.

```

```
