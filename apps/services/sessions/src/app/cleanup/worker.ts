import { NestFactory } from '@nestjs/core'

import { SessionsCleanupWorkerModule } from './worker.module'
import { SessionsCleanupService } from './worker.service'

export const worker = async () => {
  const app = await NestFactory.createApplicationContext(
    SessionsCleanupWorkerModule,
  )
  app.enableShutdownHooks()
  await app.get(SessionsCleanupService).run()
  await app.close()
  process.exit(0)
}
