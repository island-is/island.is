import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'
import { environment } from './environments'

export const bootstrapServer = () =>
  bootstrap({
    appModule: AppModule,
    name: 'payments',
    openApi,
    port: environment.port,
    enableVersioning: true,
    healthCheck: {
      database: true,
    },
  })
