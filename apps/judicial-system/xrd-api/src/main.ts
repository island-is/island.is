import { bootstrap } from '@island.is/infra-nest-server'

import { openApi } from './openApi'
import { AppModule } from './app'

bootstrap({
  appModule: AppModule,
  name: 'judicial-system-xrd-api',
  port: 3355,
  swaggerPath: 'api/swagger',
  openApi,
})
