import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'

export const bootstrapServer = () =>
  bootstrap({
    appModule: AppModule,
    name: 'application-system-api',
    openApi,
  })
