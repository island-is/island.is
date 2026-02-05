process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('UNHANDLED REJECTION raw:', reason)
})

process.on('uncaughtException', (error) => {
  // eslint-disable-next-line no-console
  console.error('UNCAUGHT EXCEPTION:', error)
})

import { NestFactory } from '@nestjs/core'
import { PruneModule } from './app/modules/services/prune/prune.module'
import { PruneService } from './app/modules/services/prune/prune.service'

export const worker = async () => {
  const app = await NestFactory.createApplicationContext(PruneModule)
  app.enableShutdownHooks()

  try {
    await app.get(PruneService).run()
  } catch (error) {
    console.error('Prune worker failed:', error)
    process.exitCode = 1
  } finally {
    await app.close()
  }
}
