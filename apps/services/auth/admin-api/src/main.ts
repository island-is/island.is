import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { environment as env } from './environments'
import { openApi } from './openApi'

bootstrap({
  appModule: AppModule,
  name: 'auth-admin-api',
  openApi,
  port: env.port,
  enableVersioning: true,
  globalPrefix: 'backend',
  healthCheck: {
    database: true,
  },
})
