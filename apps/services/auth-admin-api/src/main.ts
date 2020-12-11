import '@island.is/infra-tracing'

import { bootstrap } from '@island.is/infra-nest-server'
import { DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app/app.module'

export const config = {
  appModule: AppModule,
  name: 'auth-admin-api',
  openApi: {
    path: 'apps/services/auth-admin-api/src/openapi.yaml',
    document: new DocumentBuilder()
      .setTitle('IdentityServer Admin api')
      .setDescription('Api for administration.')
      .setVersion('1.0')
      .addTag('auth-admin-api')
      .build(),
  },
}

bootstrap(config)
