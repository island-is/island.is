import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  })
  const port = process.env.PORT || 3000
  await app.listen(port)
  Logger.log(`🚀 Application is running on: http://localhost:${port}`)
}

bootstrap()
