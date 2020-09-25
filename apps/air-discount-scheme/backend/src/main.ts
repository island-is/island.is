import '@island.is/infra-tracing'

import * as Sentry from '@sentry/node'
import { bootstrap } from '@island.is/infra-nest-server'
import { SentryInterceptor } from '@island.is/infra-monitoring'

import { AppModule } from './app/app.module'
import { environment } from './environments'
import { openApi } from './openApi'

Sentry.init({
  dsn: environment.sentry.dsn,
  environment: 'backend',
})

bootstrap({
  appModule: AppModule,
  name: 'air-discount-scheme-backend',
  port: 4248,
  interceptors: [new SentryInterceptor()],
  swaggerPath: 'api/swagger',
  openApi,
})
