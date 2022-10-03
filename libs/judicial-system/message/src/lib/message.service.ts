import { SQS } from 'aws-sdk'

import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import { messageModuleConfig } from './message.config'
import { Message } from './message'

@Injectable()
export class MessageService {
  private readonly sqs: SQS
  private _queueUrl: string | undefined

  constructor(
    @Inject(messageModuleConfig.KEY)
    private readonly config: ConfigType<typeof messageModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    this.sqs = new SQS({ endpoint: config.endpoint, region: config.region })
    this.sqs
      .getQueueUrl({ QueueName: this.config.queueName })
      .promise()
      .then((data) => {
        this.logger.info('Message queue is ready')

        this._queueUrl = data.QueueUrl
      })
      .catch((err) => {
        if (config.production) {
          this.logger.error('Failed to connect to message queue', { err })
        }

        this.sqs
          .createQueue({ QueueName: this.config.queueName })
          .promise()
          .then((data) => {
            this.logger.info('Message queue is ready')

            this._queueUrl = data.QueueUrl
          })
          .catch((err) => {
            this.logger.error('Failed to create message queue', { err })
          })
      })
  }

  private get queueUrl(): string {
    if (this._queueUrl) {
      return this._queueUrl
    }

    throw new ServiceUnavailableException('Message queue is not ready')
  }

  private async deleteMessageFromQueue(receiptHandle?: string): Promise<void> {
    return this.sqs
      .deleteMessage({
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle ?? '',
      })
      .promise()
      .then((data) => {
        if (data?.$response?.error) {
          throw data.$response.error
        }
      })
      .catch((err) => {
        this.logger.error('Failed to delete message from queue', err)
      })
  }

  private async handleMessage(
    callback: (message: Message) => Promise<boolean>,
    sqsMessage: SQS.Message,
  ): Promise<void> {
    return callback(JSON.parse(sqsMessage.Body ?? ''))
      .then((handled) => {
        if (handled) {
          return this.deleteMessageFromQueue(sqsMessage.ReceiptHandle)
        }
      })
      .catch((err) => {
        this.logger.error('Failed to handle message', { err })
      })
  }

  async postMessageToQueue(message: Message): Promise<string> {
    return this.sqs
      .sendMessage({
        QueueUrl: this.queueUrl,
        MessageBody: JSON.stringify(message),
      })
      .promise()
      .then((data) => data.MessageId ?? '')
  }

  async receiveMessageFromQueue(
    callback: (message: Message) => Promise<boolean>,
  ): Promise<void> {
    return this.sqs
      .receiveMessage({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 10,
      })
      .promise()
      .then(async (data) => {
        if (data.Messages && data.Messages.length > 0) {
          return this.handleMessage(callback, data.Messages[0])
        }
      })
  }
}
