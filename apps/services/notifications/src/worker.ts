import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ConsumerService } from './app/modules/notifications/consumer.service'

const boostrap = async () => {
  const app = await NestFactory.createApplicationContext(AppModule)
  app.enableShutdownHooks()
  await app.get(ConsumerService).run()
}

boostrap()
