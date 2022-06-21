import { NestFactory } from '@nestjs/core'

import { AppModule, AppService } from './app'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule)
  app.enableShutdownHooks()
  const service = app.get(AppService)
  await service.run()
  await app.close()
}

bootstrap()
