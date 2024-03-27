import { NestFactory } from '@nestjs/core'

import { SessionsCleanupWorkerModule } from './worker.module'
import { SessionsCleanupService } from './worker.service'

export const worker = async () => {
  try {
    console.log('Sessions cleanup worker started.')
    const app = await NestFactory.createApplicationContext(
      SessionsCleanupWorkerModule,
    )
    app.enableShutdownHooks()
    await app.get(SessionsCleanupService).run()
    await app.close()
    console.log('Sessions cleanup worker finished successfully.')
    process.exit(0)
  } catch (error) {
    console.error('Sessions cleanup worker encountered an error:', error)
    process.exit(1)
  }
}
