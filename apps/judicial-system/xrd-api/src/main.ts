import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app'
import { openApi } from './openApi'

bootstrap({
  appModule: AppModule,
  name: 'judicial-system-xrd-api',
  port: 3355,
  swaggerPath: 'api/swagger',
  openApi,
})
