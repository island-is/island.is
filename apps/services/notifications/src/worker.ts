import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { NotificationConsumerService } from './app/modules/notifications/consumer.service'

const boostrap = async () => {
  const app = await NestFactory.createApplicationContext(AppModule)
  app.enableShutdownHooks()
  app.get(NotificationConsumerService).run()
}

boostrap()
