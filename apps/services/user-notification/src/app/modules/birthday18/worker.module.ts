import { Module } from '@nestjs/common'
import { LoggingModule } from '@island.is/logging'
import { UserNotificationBirthday18WorkerService } from './worker.service'
import { environment } from '../../../environments/environment'
import { QueueModule } from '@island.is/message-queue'
import {
  NationalRegistryV3ApplicationsClientConfig,
  NationalRegistryV3ApplicationsClientModule,
} from '@island.is/clients/national-registry-v3-applications'
import { ConfigModule } from '@nestjs/config'
import { IdsClientConfig, XRoadConfig } from '@island.is/nest/config'

@Module({
  imports: [
    LoggingModule,
    QueueModule.register({
      client: environment.sqsConfig,
      queue: {
        name: 'notifications',
        queueName: environment.mainQueueName,
        shouldSleepOutsideWorkingHours: true,
        deadLetterQueue: {
          queueName: environment.deadLetterQueueName,
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        XRoadConfig,
        NationalRegistryV3ApplicationsClientConfig,
        IdsClientConfig,
      ],
    }),
    NationalRegistryV3ApplicationsClientModule,
  ],
  providers: [UserNotificationBirthday18WorkerService],
})
export class UserNotificationBirthday18Module {}
