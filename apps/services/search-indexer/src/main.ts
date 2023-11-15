import { bootstrap } from '@island.is/infra-nest-server'
import { AppModule } from './app/app.module'
export { default as migrateAws } from './migrate/migrateAws'
export { default as migrateElastic } from './migrate/migrateElastic'
export { default as migrateKibana } from './migrate/migrateKibana'

// TODO remove

if (require.main === module || process.env.NODE_ENV !== 'production') {
  // If this is being run as a script, start the server
  bootstrap({
    appModule: AppModule,
    name: 'search-indexer',
    port: 3333,
  })
}
