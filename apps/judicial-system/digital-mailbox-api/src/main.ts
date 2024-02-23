import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app'
import { openApi } from './openApi'

bootstrap({
  appModule: AppModule,
  name: 'judicial-system-digital-mailbox-api',
  port: 3357,
  swaggerPath: 'api/swagger',
  openApi,
})
