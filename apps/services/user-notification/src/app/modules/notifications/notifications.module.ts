import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { CacheModule } from '@nestjs/cache-manager'
import * as firebaseAdmin from 'firebase-admin'

import {
  NationalRegistryV3ClientConfig,
  NationalRegistryV3ClientModule,
} from '@island.is/clients/national-registry-v3'
import { EmailModule } from '@island.is/email-service'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import {
  FeatureFlagConfig,
  FeatureFlagModule,
} from '@island.is/nest/feature-flags'
import { LoggingModule } from '@island.is/logging'
import { CmsTranslationsModule } from '@island.is/cms-translations'
import { QueueModule } from '@island.is/message-queue'

import { NotificationsController } from './notifications.controller'
import { environment } from '../../../environments/environment'
import { FIREBASE_PROVIDER } from '../../../constants'
import * as userProfile from '@island.is/clients/user-profile'
import { NotificationsService } from './notifications.service'
import { MeNotificationsController } from './me-notifications.controller'
import { Notification } from './notification.model'
import { UserNotificationsInfraController } from './infra.controller'
import { NotificationDispatchService } from './notificationDispatch.service'
import {
  IS_RUNNING_AS_WORKER,
  NotificationsWorkerService,
} from './notificationsWorker.service'
import {
  APP_PROTOCOL,
  MessageProcessorService,
} from './messageProcessor.service'

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
    EmailModule.register(environment.emailOptions),
    FeatureFlagModule,
    NationalRegistryV3ClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [XRoadConfig, NationalRegistryV3ClientConfig, FeatureFlagConfig],
    }),
  ],
  controllers: [
    NotificationsController,
    MeNotificationsController,
    UserNotificationsInfraController,
  ],
  providers: [
    NotificationsService,
    NotificationDispatchService,
    NotificationsWorkerService,
    MessageProcessorService,
    {
      provide: FIREBASE_PROVIDER,
      useFactory: () =>
        process.env.INIT_SCHEMA === 'true'
          ? {}
          : firebaseAdmin.initializeApp({
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
