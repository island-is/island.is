import { bootstrap } from '@island.is/infra-nest-server'

import '@island.is/infra-tracing'

import { AppModule } from './app/app.module'

bootstrap({
  appModule: AppModule,
  name: 'ads-api',
  // port: 4242,
})
