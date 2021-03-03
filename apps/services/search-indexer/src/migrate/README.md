# Search Indexer Migration

The files inside the migration folder are build into multiple entry files an run in series inside separate `initContainers` in the cluster.  
The migration files have several tasks:

**migrateAws.ts**:

- Keep the dictionaries inside AWS up to date with the `island.is/elasticsearch-dictionaries` repo
- Manage files inside S3 buckets
- Create packages inside AWS ES
- Associate and disassociate packages with AWS ES domains

**migrateElastic.ts**:

- Keep ES indexes up to date
- Create new indices when dictionary or index templates are updated
- Migrate data from datasources into current index
- Ensure builds with a faulty index don't spin up

**migrateKibana.ts**:

- Ensure content status dashboard is up to date

You can run the migration script locally to manage your `dev-service` instance
of elasticsearch. **The migrate script assumes you have dictionary files inside
elasticsearch config and hence is unlikely to work with standard instances of
elasticsearch**

### Quick start

#### Migrate

You can run the migration with

```bash
yarn nx run services-search-indexer:migrate
```

This migrates the ES indexes to the latest version defined by the
`content-search-index-manager` library. It also imports all kibana saved
objects that are in `./config/kibana` folder.

#### Sync Kibana

You can run a kibana sync with

```bash
yarn nx run services-search-indexer:migrate --sync-kibana
```

A sync fetches saved objects from a local running kibana instance and updates
your local kibana files. It uses the ids of the objects inside the
`./config/kibana` folder and searches for them on your instance and updates
them accordingly. Remember to run `migrate` before running `sync-kibana`.
