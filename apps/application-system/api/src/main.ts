/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import '@island.is/infra-tracing'
import { DocumentBuilder } from '@nestjs/swagger'
import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app/app.module'

export const config = {
  name: 'application-system-api',
  appModule: AppModule,
  openApi: {
    path: 'apps/application-system/api/src/openapi.yaml',
    document: new DocumentBuilder()
      .setTitle('Application backend')
      .setDescription(
        'This is provided as a reference to implement other backends.',
      )
      .setVersion('1.0')
      .addTag('application')
      .build(),
  },
}

bootstrap(config)
