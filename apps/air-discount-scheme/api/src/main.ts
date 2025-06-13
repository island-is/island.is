import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'

// DEPLOYME

bootstrap({
  appModule: AppModule,
  name: 'ads-api',
  port: 4242,
})
