import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'

bootstrap({
  appModule: AppModule,
  name: 'services-university-gateway-backend',
  port: 3380,
  swaggerPath: '/api/swagger',
  openApi,
})
