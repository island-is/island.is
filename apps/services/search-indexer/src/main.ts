import '@island.is/infra-tracing'

import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'

export const config = {
  appModule: AppModule,
  name: 'search-indexer',
  port: 3333,
}

bootstrap(config)
