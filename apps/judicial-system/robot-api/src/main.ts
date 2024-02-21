import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app'
import { openApi } from './openApi'

bootstrap({
  appModule: AppModule,
  name: 'judicial-system-xrd-robot-api',
  port: 3356,
  swaggerPath: 'api/swagger',
  openApi,
})
