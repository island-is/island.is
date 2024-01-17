import { NestFactory } from '@nestjs/core'
import { UserNotificationCleanupWorkerModule } from './app/modules/cleanup/worker.module'
import { UserNotificationCleanupWorkerService } from './app/modules/cleanup/worker.service'

export const cleanup = async () => {
  const app = await NestFactory.createApplicationContext(
    UserNotificationCleanupWorkerModule,
  )
  app.enableShutdownHooks()
  await app.get(UserNotificationCleanupWorkerService).run()
  await app.close()
  process.exit(0)
}