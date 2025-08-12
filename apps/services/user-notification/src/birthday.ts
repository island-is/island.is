import { NestFactory } from '@nestjs/core'
import { UserNotificationBirthday18Module } from './app/modules/birthday18/worker.module'
import { UserNotificationBirthday18WorkerService } from './app/modules/birthday18/worker.service'

export const birthday = async () => {
  const app = await NestFactory.createApplicationContext(
    UserNotificationBirthday18Module,
  )
  app.enableShutdownHooks()
  await app.get(UserNotificationBirthday18WorkerService).run()
  await app.close()
  process.exit(0)
}
