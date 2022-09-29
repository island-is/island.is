import { Test } from '@nestjs/testing'

import { ConfigModule } from '@island.is/nest/config'
import {
  getQueueServiceToken,
  QueueModule,
  QueueService,
} from '@island.is/message-queue'

import { messageModuleConfig } from '../message.config'
import { MessageService } from '../message.service'

const config = messageModuleConfig()

export const createTestingMessageModule = async () => {
  const messageModule = await Test.createTestingModule({
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
      ConfigModule.forRoot({ load: [messageModuleConfig] }),
    ],
    providers: [MessageService],
  }).compile()

  const queueService = messageModule.get<QueueService>(
    getQueueServiceToken(config.queueName),
  )

  const messageService = messageModule.get<MessageService>(MessageService)

  return { queueService, messageService }
}
