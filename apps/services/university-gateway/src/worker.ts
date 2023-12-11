import { NestFactory } from '@nestjs/core'
import { UniversityGatewayWorkerModule } from './app/worker/worker.module'
import { UniversityGatewayWorkerService } from './app/worker/worker.service'

export const worker = async () => {
  const app = await NestFactory.createApplicationContext(
    UniversityGatewayWorkerModule,
  )
  app.enableShutdownHooks()
  await app.get(UniversityGatewayWorkerService).run()
  await app.close()
  process.exit(0)
}
