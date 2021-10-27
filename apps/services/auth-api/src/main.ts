import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { environment } from './environments'
import { openApi } from './openApi'
import { trace } from '@theo.gravity/datadog-apm'

bootstrap({
  appModule: AppModule,
  name: 'auth-api',
  openApi,
  port: environment.port,
})
