import '@island.is/infra-tracing'

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { AppService } from './app/app.service'

export const worker = async () => {
  const app = await NestFactory.createApplicationContext(AppModule)

  app.enableShutdownHooks()
  await app.get(AppService).run()
  await app.close()
  process.exit(0)
}

worker()
