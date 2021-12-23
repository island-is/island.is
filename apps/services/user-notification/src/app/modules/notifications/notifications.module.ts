import { Module } from '@nestjs/common'
import * as firebaseAdmin from 'firebase-admin'
import { LoggingModule } from '@island.is/logging'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { environment } from '../../../environments/environment'
import { QueueModule } from '@island.is/message-queue'
import { NotificationsController } from './notifications.controller'
import { NotificationsWorkerService } from './notificationsWorker.service'
import { NotificationDispatchService } from './notificationDispatch.service'
import { MessageProcessorService } from './messageProcessor.service'
import { FIREBASE_PROVIDER } from '../../../constants'

@Module({
  imports: [
    LoggingModule,
    CmsTranslationsModule,
    QueueModule.register({
      client: environment.sqsConfig,
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
  providers: [
    NotificationDispatchService,
    NotificationsWorkerService,
    MessageProcessorService,
    {
      provide: FIREBASE_PROVIDER,
      useFactory: () => firebaseAdmin.initializeApp(),
    },
  ],
})
export class NotificationsModule {}
