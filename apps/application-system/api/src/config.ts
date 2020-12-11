import { DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app/app.module'

export const config = {
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
