import { Module } from '@nestjs/common'
import { LoggingModule } from '@island.is/logging'
import { NotificationsController } from './notifications.controller'
import environment from '../../../environments/environment'
import { QueueModule } from '@island.is/message-queue'
import { NotificationsWorkerService } from './notificationsWorker.service'

@Module({
  imports: [
    LoggingModule,
    QueueModule.register({
      client: environment...,
      queue: {
        name: 'notifications',
        queueName: environment.mainQueueName,
        deadLetterQueue: {
          queueName: environment.deadLetterQueueName,
        },
      },
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsWorkerService],
})
export class NotificationsModule {}
