import '@island.is/infra-tracing'

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { CollectorScheduler } from './app/collector.scheduler'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule)
  const scheduler = app.get(CollectorScheduler)
  await scheduler.indexTask()

  await app.close()
}

bootstrap()
