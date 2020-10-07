import '@island.is/infra-tracing'
import { AppModule } from './app/app.module'
import { bootstrap } from '@island.is/infra-nest-server'

bootstrap({
  appModule: AppModule,
  name: 'search-indexer',
  port: 3333,
})
