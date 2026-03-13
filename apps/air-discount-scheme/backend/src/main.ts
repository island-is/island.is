import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'

if (!process.env.THIS_IS_REQUIRED_ENV) {
  throw new Error('Cannot find env THIS_IS_REQUIRED_ENV')
}

bootstrap({
  appModule: AppModule,
  name: 'air-discount-scheme-backend',
  port: 4248,
  swaggerPath: 'api/swagger',
  openApi,
})
