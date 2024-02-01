import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'

bootstrap({
  appModule: AppModule,
  name: 'judicial-system-api',
  port: 3333,
})
// trigger affected
