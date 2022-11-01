import {
  SQSClient,
  Message as SqsMessage,
  GetQueueUrlCommand,
  CreateQueueCommand,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  SendMessageBatchCommand,
} from '@aws-sdk/client-sqs'

import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import { messageModuleConfig } from './message.config'
import { Message } from './message'

@Injectable()
export class MessageService {
  private readonly sqs: SQSClient
  private _queueUrl: string | undefined

  constructor(
    @Inject(messageModuleConfig.KEY)
    private readonly config: ConfigType<typeof messageModuleConfig>,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {
    this.sqs = new SQSClient({
      endpoint: config.endpoint,
      region: config.region,
    })

    // TODO: Make more robust, by retrying
    this.sqs
      .send(new GetQueueUrlCommand({ QueueName: this.config.queueName }))
      .then((data) => {
        this.logger.info('Message queue is ready')

        this._queueUrl = data.QueueUrl
      })
      .catch((err) => {
        if (config.production) {
          this.logger.error('Failed to connect to message queue', { err })
        }

        this.sqs
          .send(new CreateQueueCommand({ QueueName: this.config.queueName }))
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

  private deleteMessageFromQueue(receiptHandle?: string): void {
    // No need to wait
    this.sqs
      .send(
        new DeleteMessageCommand({
          QueueUrl: this.queueUrl,
          ReceiptHandle: receiptHandle,
        }),
      )
      .catch((err) => {
        // Tolerate failure, but log error
        this.logger.error('Failed to delete message from queue', err)
      })
  }

  private async retryMessage(
    delaySeconds: number,
    messageBody?: string,
    receiptHandle?: string,
  ): Promise<void> {
    return this.sqs
      .send(
        new SendMessageCommand({
          QueueUrl: this.queueUrl,
          DelaySeconds: delaySeconds,
          MessageBody: messageBody,
        }),
      )
      .then((data) => {
        if (data.MessageId) {
          this.deleteMessageFromQueue(receiptHandle)
        } else {
          this.logger.error('Failed to send message to queue', { data })
        }
      })
  }

  private async handleMessage(
    callback: (message: Message) => Promise<boolean>,
    sqsMessage: SqsMessage,
  ): Promise<void> {
    const message: Message = JSON.parse(sqsMessage.Body ?? '')

    // The maximum delay is 900 seconds, but we want to be able to wait much longer
    const now = Date.now()
    if (message.nextRetry && message.nextRetry > now) {
      return this.retryMessage(
        Math.min(Math.round((message.nextRetry - now) / 1000), 900),
        sqsMessage.Body,
        sqsMessage.ReceiptHandle,
      )
    }

    return callback(message).then(async (handled) => {
      if (!handled) {
        const numberOfRetries = message.numberOfRetries ?? 0
        if (numberOfRetries < this.config.maxNumberOfRetries) {
          // double the interval for each retry
          const secondsUntilNextRetry =
            this.config.minRetryIntervalSeconds * 2 ** numberOfRetries

          return this.retryMessage(
            Math.min(secondsUntilNextRetry, 900),
            JSON.stringify({
              ...message,
              numberOfRetries: numberOfRetries + 1,
              nextRetry: now + secondsUntilNextRetry * 1000,
            }),
            sqsMessage.ReceiptHandle,
          )
        } else {
          this.logger.error(
            `Failed to handle message after ${numberOfRetries} retries`,
            { msg: message },
          )
        }
      }

      this.deleteMessageFromQueue(sqsMessage.ReceiptHandle)
    })
  }

  async sendMessageToQueue(message: Message): Promise<void> {
    return this.sqs
      .send(
        new SendMessageCommand({
          QueueUrl: this.queueUrl,
          MessageBody: JSON.stringify(message),
        }),
      )
      .then((data) => {
        if (!data.MessageId) {
          this.logger.error('Failed to send message to queue', { data })
        }
      })
  }

  async sendMessagesToQueue(messages: Message[]): Promise<void> {
    return this.sqs
      .send(
        new SendMessageBatchCommand({
          QueueUrl: this.queueUrl,
          Entries: messages.map((message, index) => ({
            MessageBody: JSON.stringify(message),
            Id: index.toString(),
          })),
        }),
      )
      .then((data) => {
        if (data.Failed && data.Failed.length > 0) {
          this.logger.error('Failed to send messages to queue', { data })
        }
      })
  }

  async receiveMessagesFromQueue(
    callback: (message: Message) => Promise<boolean>,
  ): Promise<void> {
    return this.sqs
      .send(
        new ReceiveMessageCommand({
          QueueUrl: this.queueUrl,
          MaxNumberOfMessages: this.config.maxNumberOfMessages,
          WaitTimeSeconds: this.config.waitTimeSeconds,
        }),
      )
      .then(async (data) => {
        if (data.Messages && data.Messages.length > 0) {
          for (const message of data.Messages) {
            await this.handleMessage(callback, message)
          }
        }
      })
  }
}
