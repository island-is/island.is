import { DocumentBuilder } from '@nestjs/swagger'

import '@island.is/infra-tracing'
import { bootstrap } from '@island.is/infra-nest-server'

import { AppModule } from './app'

bootstrap({
  appModule: AppModule,
  name: 'judicial-system-api',
  openApi: new DocumentBuilder()
    .setTitle('Judicial System Backend')
    .setDescription('This is the backend api for the judicial system.')
    .setVersion('1.0')
    .addTag('judicial-system')
    .build(),
})
