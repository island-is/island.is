import { Module } from '@nestjs/common'
import { LoggingModule } from '@island.is/logging'
import { NotificationsController } from './notifications.controller'
import { CONNECTION_PROVIDER, CONFIG_PROVIDER } from '../../../constants'
import { ConsumerService } from './consumer.service'
import { environment } from '../../../environments/environment'
import { ProducerService } from './producer.service'
import { MessageHandlerService } from './messageHandler.service'
import { createQueue } from './queueConnection.provider'

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
    ProducerService,
    ConsumerService,
    MessageHandlerService,
  ],
})
export class NotificationsModule {}
