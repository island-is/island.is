import { Inject, Injectable } from '@nestjs/common'
import { SendMessageCommand } from '@aws-sdk/client-sqs'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Message } from './dto/createNotification.dto'
import { CONNECTION_PROVIDER } from '../../../constants'
import { SqsChannel } from '../../../types'

@Injectable()
export class NotificationProducerService {
  constructor(
    @Inject(CONNECTION_PROVIDER)
    private readonly queue: SqsChannel,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async sendNotification(msg: Message): Promise<void> {
    this.logger.debug('Queueing message', msg)

    const res = await this.queue.client.send(
      new SendMessageCommand({
        MessageAttributes: {},
        MessageBody: JSON.stringify(msg),
        QueueUrl: this.queue.queueUrl,
      }),
    )

    this.logger.debug(`Message queued: ${res.MessageId}`)
  }
}
