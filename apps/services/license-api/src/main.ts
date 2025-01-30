import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'

// DEPLOYME

bootstrap({
  appModule: AppModule,
  name: 'license-api',
  openApi,
  port: 4248,
  swaggerPath: '/swagger',
  enableVersioning: true,
})
