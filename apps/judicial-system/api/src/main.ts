import '@island.is/infra-tracing'
import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app'
import { openApi } from './openApi'

bootstrap({
  appModule: AppModule,
  name: 'judicial-system-api',
  openApi,
})
