import { NestFactory } from '@nestjs/core'
import { FormInvalidationService } from './app/modules/services/form-invalidation/form-invalidation.service'
import { PruneService } from './app/modules/services/prune/prune.service'
import { WorkerModule } from './app/modules/services/worker.module'

export const worker = async () => {
  const app = await NestFactory.createApplicationContext(WorkerModule)
  app.enableShutdownHooks()

  try {
    await app.get(PruneService).run()
    await app.get(FormInvalidationService).run()
  } catch (error) {
    console.error('Form system worker failed:', error)
    process.exitCode = 1
  } finally {
    await app.close()
    process.exit(process.exitCode ?? 0)
  }
}
