import {
  CreateQueueCommand,
  DeleteMessageCommand,
  GetQueueUrlCommand,
  Message as SqsMessage,
  ReceiveMessageCommand,
  SendMessageBatchCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs'

import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { ConfigType } from '@island.is/nest/config'

import { Message } from './message'
import { messageModuleConfig } from './message.config'

@Injectable()
export class MessageService {
  private readonly sqs: SQSClient
  private connectionPromise: Promise<void> | undefined
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
  }

  private async ensureQueueConnection(): Promise<void> {
    let connecting = true

    while (connecting) {
      await this.sqs
        .send(new GetQueueUrlCommand({ QueueName: this.config.queueName }))
        .then((data) => {
          this.logger.info('Message queue is ready')

          this._queueUrl = data.QueueUrl
          connecting = false
        })
        .catch(async (err) => {
          if (this.config.production) {
            this.logger.error('Failed to connect to message queue', { err })
          } else {
            await this.sqs
              .send(
                new CreateQueueCommand({ QueueName: this.config.queueName }),
              )
              .then((data) => {
                this.logger.info('Message queue is ready')

                this._queueUrl = data.QueueUrl
                connecting = false
              })
              .catch((err) => {
                this.logger.error('Failed to create message queue', { err })
              })
          }
        })

      if (connecting) {
        // Wait a bit before trying again
        await new Promise((resolve) =>
          setTimeout(resolve, this.config.waitTimeSeconds * 1000),
        )
      }
    }

    this.connectionPromise = undefined
  }

  private async connectToQueue(): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise
    }

    this._queueUrl = undefined

    this.connectionPromise = this.ensureQueueConnection()

    return this.connectionPromise
  }

  private get queueUrl(): string {
    if (this._queueUrl) {
      return this._queueUrl
    }

    this.connectToQueue()

    throw new ServiceUnavailableException('Message queue is not ready')
  }

  private async getQueueUrl(): Promise<string> {
    if (this._queueUrl) {
      return this._queueUrl
    }

    await this.connectToQueue()

    return this.queueUrl
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

  async addMessagesToQueue(
    messages: Message[],
    isRetry = false,
  ): Promise<void> {
    const MAX_BATCH_SIZE = 10

    if (messages.length === 0) {
      return // No messages to send
    }

    if (messages.length <= MAX_BATCH_SIZE) {
      const queueUrl = await this.getQueueUrl()

      return this.sqs
        .send(
          new SendMessageBatchCommand({
            QueueUrl: queueUrl,
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
        .catch((err) => {
          this.connectToQueue()

          if (isRetry) {
            throw err
          }

          // Retry once
          return this.addMessagesToQueue(messages, true)
        })
    }

    // Slice the message batches down to the maximum batch size
    for (let i = 0; i < messages.length; i += MAX_BATCH_SIZE) {
      const numSentNow = Math.min(messages.length - i, MAX_BATCH_SIZE)
      const messagesToSend = messages.slice(i, i + numSentNow)

      await this.addMessagesToQueue(messagesToSend, isRetry)
    }
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
      .catch((err) => {
        this.connectToQueue()

        throw err
      })
  }
}
