import '@island.is/infra-tracing'

import * as Sentry from '@sentry/node'
import { SentryInterceptor } from '@island.is/infra-monitoring'
import { DocumentBuilder } from '@nestjs/swagger'
import { bootstrap } from '@island.is/infra-nest-server'

import { environment } from './environments'
import { AppModule } from './app/app.module'

Sentry.init({
  dsn: environment.sentry.dsn,
  environment: 'backend',
})

export const config = {
  appModule: AppModule,
  name: 'services-user-profile',
  interceptors: [new SentryInterceptor()],
  openApi: {
    path: 'apps/services/user-profile/src/openapi.yaml',
    document: new DocumentBuilder()
      .setTitle('User Profile backend')
      .setDescription('Backend providing user profiles for Island.is')
      .setVersion('1.0')
      .addTag('User Profile', 'User profile api for Island.is users ')
      .build(),
  },
}

bootstrap(config)
