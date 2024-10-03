```md
# Content Search Indexer

This library consolidates importers from multiple projects to facilitate data import into Elasticsearch for use by the content search engine.

## Creating an Importer

### Quick Start

1. Develop an importer NestJS service for your project and incorporate it into a NestJS module.
2. Integrate your NestJS module with the code in `indexing.module.ts`.
3. Integrate your NestJS service with the code in `indexing.service.ts`.

Upon completion, your data will be imported when invoking the `/sync` or `/re-sync` endpoint.

#### Overview

- Types are provided by the `@island.is/content-search-indexer/types` library to streamline the implementation process (refer to the example below).
- An importer service must at least provide the `doSync` function (refer to the example below).
- `SyncOptions` are provided as parameters to the `doSync` function (refer to **Importing Data** for details).
- `doSync` should return a `SyncResponse` or `null` (refer to **Importing Data** for details).
- Optionally, an importer can implement a `postSync` function, executed subsequent to the `doSync` function (refer to **Post Sync** for details).
- The `postSync` function receives `postSyncOptions` returned by `doSync` in its `SyncResponse` (refer to **Post Sync** for details).

Example:

```ts
// myCustomImporter.service.ts
import {
  ContentSearchImporter,
  SyncOptions,
  SyncResponse,
} from '@island.is/content-search-indexer/types'

export class MyCustomImporterService implements ContentSearchImporter {
  async doSync(options: SyncOptions): Promise<SyncResponse | null> {
    // ... perform an external request here and map your data

    // Returning null indicates opting out of a sync request.
    if (!needToSync) {
      return null
    }

    return {
      add: [], // <-- includes data to be imported of type MappedData[]
      remove: [], // <-- includes an array of Elasticsearch IDs (as strings) to be removed
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
```

## Importing Data

The importer must return `MappedData` type data in `SyncResponse.add`. Your importer should support three import types (SyncOptions.syncType):

- **full**: Triggered by a `/re-sync` endpoint call.
  This sync type should import all indexable data from the inception. Typically, in production, this sync type is invoked manually to rectify out-of-sync or stale data within the index. The indexer removes all documents not returned in this sync type from the index.
- **fromLast**: Triggered by a `/sync` endpoint call.
  This sync type should import new or updated data since the last sync.
- **initialize**: Triggered upon the deployment of an indexer container.
  This sync type should verify if any changes exist and perform a full sync if necessary, ensuring index data remains current during deployment.

Locale details are provided via **SyncOptions.locale**. Your importer should return an empty `SyncResponse` if a locale is unsupported by the search engine.

The name of the Elasticsearch index is communicated through **SyncOptions.elasticIndex** if data from the index is needed during syncing.

## Post Sync (Optional)

`postSync` is a function executed by the indexer following `doSync` and after successfully importing all data into Elasticsearch. This function is suitable for cleanup activities, such as releasing locks or maintaining last sync tokens. To implement, export a `postSync` function from your importer; it will receive `postSyncOptions` from the `SyncResponse` returned by `doSync`.

## Error Handling

Ensure your importer is resilient but avoids concealing critical errors. For instance, minor issues like `Missing title in one entry` are preferable to not throw errors, whereas critical issues like `Cannot connect to data source` should propagate errors to halt all importers. The importer operates when new index versions are populated during deployments, thus it should fail under critical error conditions.
```