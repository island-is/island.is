import { Injectable } from '@nestjs/common'

import { InjectQueue, QueueService } from '@island.is/message-queue'

import { Message } from './message'
import { messageModuleConfig } from './message.config'

@Injectable()
export class MessageService {
  constructor(
    @InjectQueue(messageModuleConfig().queueName)
    private queueService: QueueService,
  ) {}

  postMessageToQueue(message: Message): Promise<string> {
    return this.queueService.add(message)
  }
}
