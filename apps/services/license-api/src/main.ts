import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'

bootstrap({
  appModule: AppModule,
  name: 'license-api',
  openApi,
  port: 4248,
  swaggerPath: '/swagger',
  enableVersioning: true,
})
