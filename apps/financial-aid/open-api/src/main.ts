import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app'
import { openApi } from './openApi'

bootstrap({
  appModule: AppModule,
  name: 'financial-aid-open-api',
  port: 3355,
  swaggerPath: 'api/swagger',
  openApi,
})
