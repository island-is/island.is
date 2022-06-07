import { Module } from '@nestjs/common'

import { ConfigModule } from '@island.is/nest/config'
import { QueueModule } from '@island.is/message-queue'

import { AppService } from './app.service'
import { appModuleConfig } from './app.config'

const config = appModuleConfig()

@Module({
  imports: [
    ConfigModule.forRoot({ load: [appModuleConfig] }),
    QueueModule.register({
      queue: {
        name: config.sqsQueueName,
        queueName: config.sqsQueueName,
        deadLetterQueue: { queueName: config.sqsDeadLetterQueueName },
        maxConcurrentJobs: 1,
      },
      client: {
        endpoint: config.sqsEndpoint,
        region: config.sqsRegion,
      },
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
