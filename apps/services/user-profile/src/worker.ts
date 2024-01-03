import { NestFactory } from '@nestjs/core'
import { UserProfileWorkerModule } from './app/worker/worker.module'
import { UserProfileWorkerService } from './app/worker/worker.service'

export const worker = async () => {
  const app = await NestFactory.createApplicationContext(
    UserProfileWorkerModule,
  )
  app.enableShutdownHooks()
  await app.get(UserProfileWorkerService).run()
  await app.close()
  process.exit(0)
}
