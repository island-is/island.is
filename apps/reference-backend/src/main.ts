import '@island.is/infra-tracing'
import { DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app/app.module'
import { bootstrap } from '@island.is/infra-nest-server'

bootstrap({
  appModule: AppModule,
  name: 'reference-backend',
  openApi: new DocumentBuilder()
    .setTitle('Reference backend')
    .setDescription(
      'This is provided as a reference to implement other backends.',
    )
    .setVersion('1.0')
    .addTag('reference')
    .build(),
})
