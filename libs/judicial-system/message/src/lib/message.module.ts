import { Module } from '@nestjs/common'

import { QueueModule } from '@island.is/message-queue'

import { MessageService } from './message.service'
import { messageModuleConfig } from './message.config'

const config = messageModuleConfig()

@Module({
  imports: [
    QueueModule.register({
      queue: {
        name: config.queueName,
        queueName: config.queueName,
        deadLetterQueue: { queueName: config.deadLetterQueueName },
      },
      client: {
        endpoint: config.endpoint,
        region: config.region,
      },
    }),
  ],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
