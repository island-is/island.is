import { Module } from '@nestjs/common'
import * as firebaseAdmin from 'firebase-admin'
import { CacheModule } from '@nestjs/cache-manager'
import { LoggingModule } from '@island.is/logging'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { environment } from '../../../environments/environment'
import { QueueModule } from '@island.is/message-queue'
import { NotificationsController } from './notifications.controller'
import {
  IS_RUNNING_AS_WORKER,
  NotificationsWorkerService,
} from './notificationsWorker.service'
import { NotificationDispatchService } from './notificationDispatch.service'
import {
  APP_PROTOCOL,
  MessageProcessorService,
} from './messageProcessor.service'
import { FIREBASE_PROVIDER } from '../../../constants'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import * as userProfile from '@island.is/clients/user-profile'
import { NotificationsService } from './notifications.service'
import { MeNotificationsController } from './me-notifications.controller'
import { SequelizeModule } from '@nestjs/sequelize'
import { Notification } from './notification.model'

@Module({
  imports: [
    SequelizeModule.forFeature([Notification]),
    CacheModule.register({
      ttl: 60 * 10 * 1000, // 10 minutes
      max: 100, // 100 items max
    }),
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
  controllers: [NotificationsController, MeNotificationsController],
  providers: [
    NotificationsService,
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
              circuitBreaker: true,
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
  exports: [NotificationsService],
})
export class NotificationsModule {}
