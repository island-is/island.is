import '@island.is/infra-tracing'
import { DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app/app.module'
import { bootstrap } from '@island.is/infra-nest-server'

bootstrap({
  appModule: AppModule,
  name: 'auth-api',
  openApi: new DocumentBuilder()
    .setTitle('IdentityServer Admin api')
    .setDescription(
      'Api for administration.',
    )
    .setVersion('1.0')
    .addTag('auth-admin-api')
    .build(),
})