import * as Sentry from '@sentry/node'

import { SentryInterceptor } from '@island.is/infra-monitoring'
import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'
import { environment } from './environments'

Sentry.init({
  dsn: environment.sentry.dsn,
  environment: 'api',
})

bootstrap({
  appModule: AppModule,
  name: 'ads-api',
  port: 4242,
  interceptors: [new SentryInterceptor()],
})
