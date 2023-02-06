import { NestFactory } from '@nestjs/core'

import { WorkerModule } from './worker.module'

export const worker = async () => {
  const app = await NestFactory.createApplicationContext(WorkerModule)
  app.enableShutdownHooks()
}
