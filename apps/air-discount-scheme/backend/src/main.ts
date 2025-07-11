import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'

// DEPLOYME

bootstrap({
  appModule: AppModule,
  name: 'air-discount-scheme-backend',
  port: 4248,
  swaggerPath: 'api/swagger',
  openApi,
})
