import '@island.is/infra-tracing'

import { DocumentBuilder } from '@nestjs/swagger'
import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'

export const config = {
  appModule: AppModule,
  name: 'auth-api',
  openApi: {
    path: 'apps/services/auth-api/src/openapi.yaml',
    document: new DocumentBuilder()
      .setTitle('IdentityServer Api')
      .setDescription('Api for IdentityServer.')
      .setVersion('1.0')
      .addTag('auth-api')
      .build(),
  },
}

bootstrap(config)
