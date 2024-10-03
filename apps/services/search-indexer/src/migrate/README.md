# Search Indexer Migration

The files in the migration folder are executed in series within separate `initContainers` in the cluster. These files perform various tasks:

**migrateAws.ts**:
- Update AWS dictionaries with `island.is/elasticsearch-dictionaries` repo
- Manage S3 bucket files
- Create AWS ES packages
- Associate/disassociate packages with AWS ES domains

**migrateElastic.ts**:
- Update ES indexes
- Create new indexes upon dictionary or index template updates
- Migrate data into the current index
- Prevent faulty index builds from launching

**migrateKibana.ts**:
- Keep the content status dashboard updated

Run the migration script locally to manage your `dev-service` instance of Elasticsearch. **The script requires dictionary files in Elasticsearch config and typically won't work with standard instances.**

### Quick Start

#### Migrate

Run the migration with:

```bash
yarn nx run services-search-indexer:migrate
```

This updates ES indexes to the latest version as per `content-search-index-manager` library and imports Kibana saved objects from `./config/kibana`.

#### Sync Kibana

To sync Kibana, use:

```bash
yarn nx run services-search-indexer:migrate --sync-kibana
```

This sync pulls saved objects from a local Kibana instance and updates your local files using IDs from `./config/kibana`. Run `migrate` before `sync-kibana`.