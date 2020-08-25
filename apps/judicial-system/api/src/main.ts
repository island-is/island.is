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
  name: 'judicial-system-api',
  openApi: new DocumentBuilder()
    .setTitle('Judicial System Backend')
    .setDescription('This is the backend api for the judicial system.')
    .setVersion('1.0')
    .addTag('judicial-system')
    .build(),
  enableCors: true,
})
