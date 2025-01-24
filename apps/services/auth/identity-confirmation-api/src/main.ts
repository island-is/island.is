import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { environment } from './environments'
import { openApi } from './openApi'

bootstrap({
  appModule: AppModule,
  name: 'identity-confirmation-api',
  openApi,
  port: environment.port,
  enableVersioning: true,
  healthCheck: {
    database: true,
  },
})
