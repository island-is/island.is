import { NestFactory } from '@nestjs/core'
import { ApplicationLifecycleModule } from './app/modules/application/lifecycle/application-lifecycle.module'
import { ApplicationLifeCycleService } from './app/modules/application/lifecycle/application-lifecycle.service'

export const worker = async () => {
  const app = await NestFactory.createApplicationContext(
    ApplicationLifecycleModule,
  )
  app.enableShutdownHooks()
  await app.get(ApplicationLifeCycleService).run()
  await app.close()
  process.exit(0)
}
