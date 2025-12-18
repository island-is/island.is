import { NestFactory } from '@nestjs/core'
import { PruneModule } from './app/modules/services/prune/prune.module'
import { PruneService } from './app/modules/services/prune/prune.service'

export const worker = async () => {
  const app = await NestFactory.createApplicationContext(PruneModule)
  app.enableShutdownHooks()
  try {
    await app.get(PruneService).run()
    await app.close()
    process.exit(0)
  } catch (error) {
    console.error('Prune worker failed:', error)
    await app.close()
    process.exit(1)
  }
}
