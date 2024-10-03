# Search Indexer Migration

The files inside the migration folder are built into multiple entry files and run in series inside separate `initContainers` in the cluster. The migration files manage several tasks:

**migrateAws.ts**:

- Update AWS dictionaries with the `island.is/elasticsearch-dictionaries` repo
- Manage files in S3 buckets
- Create packages inside AWS ES
- Associate and disassociate packages with AWS ES domains

**migrateElastic.ts**:

- Update ES indexes
- Create new indices when dictionary or index templates are updated
- Migrate data from data sources into the current index
- Ensure builds with faulty indices don't spin up

**migrateKibana.ts**:

- Update the content status dashboard

You can run the migration script locally to manage your `dev-service` instance of Elasticsearch. **The script assumes dictionary files are in Elasticsearch config and may not work with standard Elasticsearch instances.**

### Quick Start

#### Migrate

Run the migration with:

```bash
yarn nx run services-search-indexer:migrate
```

This updates the ES indexes to the latest version as defined by the `content-search-index-manager` library and imports all Kibana saved objects from the `./config/kibana` folder.

#### Sync Kibana

Run a Kibana sync with:

```bash
yarn nx run services-search-indexer:migrate --sync-kibana
```

This fetches saved objects from a local Kibana instance and updates local Kibana files, using the IDs in the `./config/kibana` folder. Ensure to run `migrate` before `sync-kibana`.