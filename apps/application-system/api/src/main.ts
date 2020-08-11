/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import '@island.is/infra-tracing'
import { DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app/app.module'
import { bootstrap } from '@island.is/infra-nest-server'

bootstrap({
  appModule: AppModule,
  name: 'application-system-api',
  openApi: new DocumentBuilder()
    .setTitle('Reference backend')
    .setDescription(
      'This is provided as a reference to implement other backends.',
    )
    .setVersion('1.0')
    .addTag('application')
    .build(),
})
