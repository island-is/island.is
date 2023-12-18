import {
  NationalRegistryV3ClientConfig,
  NationalRegistryV3ClientModule,
} from '@island.is/clients/national-registry-v3'
import { EmailModule } from '@island.is/email-service'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import {
  FeatureFlagConfig,
  FeatureFlagModule,
} from '@island.is/nest/feature-flags'
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
import {
  Configuration,
  V2UsersApi,
  V2UserTokensApi,
} from '@island.is/clients/user-profile'
import { NotificationsService } from './notifications.service'
import { UserProfileScope } from '@island.is/auth/scopes'

@Module({
  imports: [
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
  controllers: [NotificationsController],
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
    ...[
      {
        api: V2UsersApi,
        name: 'services-user-notification-v2',
      },
      {
        api: V2UserTokensApi,
        name: 'services-user-token-profile-v2',
      },
    ].map(({ api, name }) => ({
      provide: api,
      useFactory: () =>
        new api(
          new Configuration({
            basePath: environment.userProfileServiceBasePath,
            fetchApi: createEnhancedFetch({
              name: name,
              circuitBreaker: true,
              autoAuth: {
                issuer: environment.identityServerPath,
                clientId: environment.notificationsClientId,
                clientSecret: environment.notificationsClientSecret,
                scope: [UserProfileScope.admin],
                mode: 'auto',
              },
            }),
          }),
        ),
    })),
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
