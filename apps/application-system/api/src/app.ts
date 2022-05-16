import { bootstrap } from '@island.is/infra-nest-server'
import * as Sentry from '@sentry/node'

import { AppModule } from './app/app.module'
import { SentryInterceptor } from './interceptors'
import { environment } from './environments'
import { openApi } from './openApi'

Sentry.init({
  dsn: environment.sentryDsn,
  environment: 'api',
})

export const bootstrapServer = () => {
  bootstrap({
    appModule: AppModule,
    name: 'application-system-api',
    openApi,
    interceptors: [new SentryInterceptor()],
  })
}
