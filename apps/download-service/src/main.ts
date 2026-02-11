import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { openApi } from './openApi'

bootstrap({
  appModule: AppModule,
  name: 'download-service',
  openApi,
  port: 3377,
  globalPrefix: 'download/v1',
})
