import express from 'express'

import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule, MessageService } from './app'

async function bootstrap() {
  const port = process.env.PORT || 3366

  const app = await NestFactory.create(AppModule)
  app.enableShutdownHooks()

  app.use(express.json({ type: ['application/json'] }))

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port)
  })

  const service = app.get(MessageService)
  await service.run()
}

bootstrap()
