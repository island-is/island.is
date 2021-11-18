import { Module } from '@nestjs/common'
import { LoggingModule } from '@island.is/logging'
import { NotificationsController } from './notifications.controller'
import { CONNECTION_PROVIDER, CONFIG_PROVIDER } from '../../../constants'
import { NotificationConsumerService } from './consumer.service'
import { environment } from '../../../environments/environment'
import { NotificationProducerService } from './producer.service'
import { MessageHandlerService } from './messageHandler.service'
import { createQueue } from './connection.provider'

@Module({
  imports: [LoggingModule],
  controllers: [NotificationsController],
  providers: [
    {
      provide: CONFIG_PROVIDER,
      useValue: environment,
    },
    {
      provide: CONNECTION_PROVIDER,
      useFactory: async () => await createQueue(environment),
    },
    NotificationProducerService,
    NotificationConsumerService,
    MessageHandlerService,
  ],
})
export class NotificationsModule {}
