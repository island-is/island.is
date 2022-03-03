import { Module } from '@nestjs/common'
import * as firebaseAdmin from 'firebase-admin'

import { createEnhancedFetch } from '@island.is/clients/middlewares'
import * as userProfile from '@island.is/clients/user-profile'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { LoggingModule } from '@island.is/logging'
import { QueueModule } from '@island.is/message-queue'

import { FIREBASE_PROVIDER } from '../../../constants'
import { environment } from '../../../environments/environment'

import {
  APP_PROTOCOL,
  MessageProcessorService,
} from './messageProcessor.service'
import { NotificationDispatchService } from './notificationDispatch.service'
import { NotificationsController } from './notifications.controller'
import {
  IS_RUNNING_AS_WORKER,
  NotificationsWorkerService,
} from './notificationsWorker.service'

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
      useFactory: () =>
        firebaseAdmin.initializeApp({
          credential: firebaseAdmin.credential.cert(
            JSON.parse(environment.firebaseCredentials),
          ),
        }),
    },
    {
      provide: userProfile.UserProfileApi,
      useFactory: () =>
        new userProfile.UserProfileApi(
          new userProfile.Configuration({
            basePath: environment.userProfileServiceBasePath,
            fetchApi: createEnhancedFetch({
              name: 'services-user-notification',
              circuitBreaker: false,
              autoAuth: {
                issuer: environment.identityServerPath,
                clientId: environment.notificationsClientId,
                clientSecret: environment.notificationsClientSecret,
                scope: ['@island.is/user-profile:admin'],
                mode: 'auto',
              },
            }),
          }),
        ),
    },
    {
      provide: IS_RUNNING_AS_WORKER,
      useValue: environment.isWorker,
    },
    {
      provide: APP_PROTOCOL,
      useValue: environment.appProtocol,
    },
  ],
})
export class NotificationsModule {}
