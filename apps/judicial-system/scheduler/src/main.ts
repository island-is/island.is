import { NestFactory } from '@nestjs/core'

import { LoggingModule } from '@island.is/logging'

import { AppModule, AppService } from './app'

import '@island.is/infra-tracing'

const bootstrap = async () => {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: LoggingModule.createLogger(),
  })
  app.enableShutdownHooks()
  const service = app.get(AppService)
  await service.run()
  await app.close()
}

bootstrap()
