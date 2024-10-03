```markdown
# Search Indexer Migration

The migration directory contains multiple entry files that are executed in series within separate `initContainers` in the cluster. The migration files serve several tasks:

**migrateAws.ts**:

- Maintain the dictionaries in AWS up-to-date with the `island.is/elasticsearch-dictionaries` repository.
- Manage files within S3 buckets.
- Create packages in AWS Elasticsearch Service (ES).
- Associate and disassociate packages with AWS ES domains.

**migrateElastic.ts**:

- Keep Elasticsearch (ES) indexes updated.
- Create new indices when dictionaries or index templates are revised.
- Migrate data from data sources into the current index.
- Prevent faulty index builds from deploying.

**migrateKibana.ts**:

- Ensure the content status dashboard is current.

The migration script can be run locally to manage your `dev-service` instance of Elasticsearch. **Note: The migration script requires dictionary files within Elasticsearch configurations and may not function with standard Elasticsearch instances.**

### Quick Start

#### Migrate

Execute the migration with the following command:

```bash
yarn nx run services-search-indexer:migrate
```

This process updates the ES indexes to the latest version specified by the `content-search-index-manager` library. It also imports all Kibana saved objects located in the `./config/kibana` directory.

#### Sync Kibana

Execute a Kibana sync with:

```bash
yarn nx run services-search-indexer:migrate --sync-kibana
```

A sync retrieves saved objects from a locally running Kibana instance and updates your local Kibana files. It searches for the objects' IDs in the `./config/kibana` directory on your instance and updates them accordingly. Be sure to perform `migrate` before running `sync-kibana`.
```