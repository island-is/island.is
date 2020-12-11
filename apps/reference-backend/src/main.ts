import '@island.is/infra-tracing'

import { bootstrap } from '@island.is/infra-nest-server'
import { DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app/app.module'

export const config = {
  appModule: AppModule,
  name: 'reference-backend',
  openApi: {
    path: 'apps/reference-backend/src/openapi.yaml',
    document: new DocumentBuilder()
      .setTitle('Reference backend')
      .setDescription(
        'This is provided as a reference to implement other backends.',
      )
      .setVersion('1.0')
      .addTag('reference')
      .build(),
  },
}

bootstrap(config)
