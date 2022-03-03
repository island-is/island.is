import * as Sentry from '@sentry/node'

import { SentryInterceptor } from '@island.is/infra-monitoring'
import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { environment } from './environments'
import { openApi } from './openApi'

Sentry.init({
  dsn: environment.sentry.dsn,
  environment: 'backend',
})

bootstrap({
  appModule: AppModule,
  name: 'services-user-profile',
  interceptors: [new SentryInterceptor()],
  openApi,
  swaggerPath: '',
  port: environment.port,
})
