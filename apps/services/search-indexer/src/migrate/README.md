# Search indexer migration

The code inside the migration folder is built into a single file which is run
on `initContainer` inside the cluster. The migration file has several tasks:

- Keep the dictionaries inside AWS up to date with `elasticsearch-dictionaries`
  - Manage files inside S3 buckets
  - Create packages inside AWS ES
  - Associate and disassociate packages with AWS ES domains
  - Cleanup old packages inside AWS ES
- Keep ES indexes up to date
  - Create new indexes
  - Migrate data from one index to another
  - Manage aliases
  - Rollback to last deployed version on failure

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

This migrates the ES indexes to the latest version defined in the
`./config/template-{LOCALE}.json` files. It also imports all kibana saved
objects that are in `./config/kibana` folder.

#### Sync

You can run a sync with

```bash
yarn nx run services-search-indexer:migrate --sync
```

A sync fetches data from running services and updates your local files. This
finds the ids of the objects inside `./config/kibana` and searches for them on
your local running Kibana instance and updates them accordingly. Remember to
run `migrate` before running `sync`.
