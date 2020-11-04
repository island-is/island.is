import '@island.is/infra-tracing'
import { AppModule } from './app/app.module'
import { openApi } from './openApi'
import * as Sentry from '@sentry/node'
import { environment } from './environments'
import { SentryInterceptor } from '@island.is/infra-monitoring'

import { bootstrap } from '@island.is/infra-nest-server'

Sentry.init({
  dsn: environment.sentry.dsn,
  environment: 'backend',
})

bootstrap({
  appModule: AppModule,
  name: 'services-user-profile',
  interceptors: [new SentryInterceptor()],
  openApi,
})
