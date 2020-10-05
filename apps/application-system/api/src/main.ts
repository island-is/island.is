/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import '@island.is/infra-tracing'
import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'

bootstrap({
  appModule: AppModule,
  name: 'application-system-api',
  openApi,
})
