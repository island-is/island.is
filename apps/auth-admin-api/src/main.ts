/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

// import { Logger } from '@nestjs/common'
// import { NestFactory } from '@nestjs/core'

// import { AppModule } from './app/app.module'

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule)
//   const globalPrefix = 'api'
//   app.setGlobalPrefix(globalPrefix)
//   const port = process.env.PORT || 3333
//   await app.listen(port, () => {
//     Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix)
//   })
// }

// bootstrap()


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