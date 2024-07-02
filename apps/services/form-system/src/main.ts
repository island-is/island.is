/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app/app.module'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('FormSystem Api')
    .setDescription('Api for FormSystem.')
    .setVersion('1.0')
    .addTag('form-system-api')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const port = process.env.PORT || 3000
  await app.listen(port)
  Logger.log(`🚀 Application is running on: http://localhost:${port}`)
}

bootstrap()
