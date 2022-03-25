import { bootstrap } from '@island.is/infra-nest-server'
import * as Sentry from '@sentry/node'

import { AppModule } from './app/app.module'
import { SentryInterceptor } from './interceptors'
import { openApi } from './openApi'

Sentry.init({
  dsn:
    'https://22093678b2b24a0cad25111c1806a8d7@o406638.ingest.sentry.io/5530607',
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
