import '@island.is/infra-tracing'
import { DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app/app.module'
import { bootstrap } from '@island.is/infra-nest-server'

bootstrap({
  appModule: AppModule,
  name: 'air-discount-scheme-backend',
  port: 4248,
  swaggerPath: 'api/swagger',
  openApi: new DocumentBuilder()
    .setTitle('Air Discount Scheme')
    .setDescription(
      'This is documentation is provided for airline booking site for integration purposes.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build(),
})
