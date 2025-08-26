import express from 'express'

import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { LoggingModule } from '@island.is/logging'

import { AppModule, appModuleConfig, MessageHandlerService } from './app'

import '@island.is/infra-tracing'

const bootstrap = async () => {
  const port = process.env.PORT || 3366

  const app = await NestFactory.create(AppModule, {
    logger: LoggingModule.createLogger(),
  })
  app.enableShutdownHooks()
  app.use(express.json({ type: ['application/json'] }))

  // Give the app a chance to start up before starting to handle messages.
  // This is also useful in local development where the app might be restarted before shutting down.
  await new Promise((resolve) =>
    setTimeout(resolve, appModuleConfig().waitTimeSeconds * 1000),
  )

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port)
  })

  const service = app.get(MessageHandlerService)
  service.run()
}

bootstrap()
