import { Module } from '@nestjs/common'
import { LoggingModule } from '@island.is/logging'
import { NotificationsController } from './notifications.controller'
import { CONFIG_PROVIDER } from '../../../constants'
import { ConsumerService } from './consumer.service'
import { environment } from '../../../environments/environment'
import { ProducerService } from './producer.service'
import { MessageHandlerService } from './messageHandler.service'
import { QueueConnectionProvider } from './queueConnection.provider'

@Module({
  imports: [LoggingModule],
  controllers: [NotificationsController],
  providers: [
    {
      provide: CONFIG_PROVIDER,
      useValue: environment,
    },
    QueueConnectionProvider,
    ProducerService,
    ConsumerService,
    MessageHandlerService,
  ],
})
export class NotificationsModule {}
