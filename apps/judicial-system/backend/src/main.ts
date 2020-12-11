import '@island.is/infra-tracing'

import { bootstrap } from '@island.is/infra-nest-server'
import { DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app'

export const config = {
  appModule: AppModule,
  name: 'judicial-system-backend',
  port: 3344,
  swaggerPath: 'api/swagger',
  openApi: {
    path: 'apps/judicial-system/backend/src/openapi.yaml',
    document: new DocumentBuilder()
      .setTitle('Judicial System Backend')
      .setDescription('This is the backend for the judicial system.')
      .setVersion('1.0')
      .addTag('judicial-system')
      .build(),
  },
}

bootstrap(config)
