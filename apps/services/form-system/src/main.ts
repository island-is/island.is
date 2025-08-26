/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { AppModule } from './app/app.module'
import { openApi } from './openApi'
import { bootstrap } from '@island.is/infra-nest-server'

bootstrap({
  appModule: AppModule,
  name: 'services-form-system-api',
  openApi,
  swaggerPath: 'api/swagger',
  port: 3434,
})
