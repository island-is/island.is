import { NestFactory } from '@nestjs/core'
import { EndorsementSystemCleanupWorkerModule } from './app/cleanup/worker.module'
import { EndorsementSystemCleanupWorkerService } from './app/cleanup/worker.service'

export const cleanup = async () => {
  const app = await NestFactory.createApplicationContext(
    EndorsementSystemCleanupWorkerModule,
  )
  app.enableShutdownHooks()
  await app.get(EndorsementSystemCleanupWorkerService).run()
  await app.close()
  process.exit(0)
}
