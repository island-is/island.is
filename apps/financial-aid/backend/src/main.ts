import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app'
import { openApi } from './openApi'

bootstrap({
  appModule: AppModule,
  name: 'financial-aid-backend',
  port: 3344,
  swaggerPath: 'api/swagger',
  openApi,
})
