# Search Indexer Migration

Files in the migration folder are built into multiple entry files and executed in series within separate `initContainers` in the cluster. These files perform various tasks:

**migrateAws.ts**:

- Update AWS dictionaries using the `island.is/elasticsearch-dictionaries` repository.
- Manage S3 bucket files.
- Create and manage packages within AWS Elasticsearch (ES).
- Associate/disassociate packages with AWS ES domains.

**migrateElastic.ts**:

- Update ES indexes.
- Create new indexes when dictionary or template changes occur.
- Migrate data from sources to the current index.
- Prevent deployments with faulty indexes.

**migrateKibana.ts**:

- Update content status dashboard.

Run the migration script locally to manage your `dev-service` instance of Elasticsearch. **Note: The script presumes Elasticsearch contains dictionary files and may not function with standard instances.**

### Quick Start

#### Migrate

Execute migration with:

```bash
yarn nx run services-search-indexer:migrate
```

This updates ES indexes to the latest version as per the `content-search-index-manager` library and imports all Kibana saved objects from the `./config/kibana` folder.

#### Sync Kibana

Execute a Kibana sync with:

```bash
yarn nx run services-search-indexer:migrate --sync-kibana
```

This retrieves saved objects from a local Kibana instance and updates local Kibana files, using IDs in the `./config/kibana` folder. Ensure `migrate` runs before `sync-kibana`.