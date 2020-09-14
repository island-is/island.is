# Search indexer migration

The code inside the migration folder is built into a single file which is run on `initContainer` inside the cluster.  
The migration file has several tasks:

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

You can run the migration script locally to manage your `dev-service` instance of elasticsearch.  
**The migrate script assumes you have dictionary files inside elasticsearch config and hence is unlikely to work with standard instances of elasticsearch**

### Quick start

You can run the migration with `yarn nx run services-search-indexer:migrate`  
This migrates the ES indexes to the latest version defined in the `./config/template-{LOCALE}.json` files
