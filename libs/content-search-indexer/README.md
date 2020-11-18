# content-search-indexer

This library groups together importers from multiple projects to import data into the search engine.

# Create an importer

Types are exported from the `@island.is/content-search-indexer/types` library to ease implementation (see example below).  
An importer service must export at least the `doSync` function.  
`SyncOptions` is passed to the importer service as a parameter to the `doSync` function (see **Importing data** section for details ).  
`doSync` must resolve to `SyncResponse` or `null` when called.  
Optionally an importer can export a `postSync` function that is called after the importer has executed it's `doSync` function.  
The `postSync` function is passed the `postSyncOptions` returned by `doSync` in it's `SyncResponse` (see **Post sync** section for details).

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
    // ... do external request here and map your data

    // you can opt out of a sync request by having your importer return null
    if (!needToSync) {
      return null
    }

    return {
      add: [], // <-- includes data to be imported of type MappedData[]
      remove: [], // <-- includes an array of elasticsearch ids (as strings) to be removed
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

## Importing data

The importer must return data of type `MappedData` in the add field of `SyncResponse`.  
You importer should support three types of imports (SyncOptions.syncType):

- **full**: Is triggered by a call to the `/re-sync` endpoint. Should import all indexable data since the beginning of time.  
  In production this type of sync should only be called manually and only if the index is out of sync or contains stale data.  
  The indexer removes all documents form the index not returned in this type of sync.
- **fromLast**: Is triggered by a call to the `/sync` endpoint. This type of sync should import new/updated data since last sync.
- **initialize**: Is triggered by a deployment of a container in the cluster. This should validate if the importer contains any changes, and run a full sync if it does, this is to ensure the data in the index is up to date when it is being deployed.

The locale is passed with **SyncOptions.locale** you importer should return an empty `SyncResponse` if a locale in the search engine is not supported.

The name of the elastic index is passed with **SyncOptions.elasticIndex** in case data from the index is needed during sync.

## Post sync (optional)

`postSync` is a function called by the indexer after `doSync` and after all data has been imported into elastic.  
This function can serve as a cleanup function e.g. to release locks or maintain last sync tokens.  
To use you export a function called `postSync` from your importer, it then gets passed the `postSyncOptions` you returned from `doSync` as part of `SyncResponse`.

## Error handling

Your importer should be robust, but not so that it hides critical errors e.g.  
Missing title in one entry, should probably not throw an error and hence stop all importers.  
Your importer can't connect to it's data source probably should throw an error and hence stop all importers.  
The importer is used when populating new versions of the indexes when deploying new versions of our apps hence we don't want the importer to succeed when it shouldn't.

## Quick start

1. Create an importer nestjs service for your project and export it with a nestjs module
2. Import and add your nestjs module to the code in `indexing.module.ts`
3. Import and add your nestjs service to the code in `indexing.service.ts`

Your data should now be imported when you call the `/sync` or `/re-sync` endpoint
