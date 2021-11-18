import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common'
import {
  Message as SqsMessage,
  ReceiveMessageCommand,
  DeleteMessageBatchCommand,
} from '@aws-sdk/client-sqs'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { CONNECTION_PROVIDER } from '../../../constants'
import { SqsChannel } from '../../../types'
import { MessageHandlerService } from './messageHandler.service'

@Injectable()
export class NotificationConsumerService implements OnModuleDestroy {
  private currentBatchProcessing: Promise<void> = Promise.resolve()
  private shutdown = false

  constructor(
    private readonly messageHandler: MessageHandlerService,
    @Inject(CONNECTION_PROVIDER)
    private readonly queue: SqsChannel,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  async onModuleDestroy() {
    this.shutdown = true

    this.logger.info('Waiting for workers to finish')
    await this.currentBatchProcessing

    this.logger.info('Closing connection')
    this.queue.client.destroy()
  }

  async run(): Promise<void> {
    this.logger.info('Starting consumer')

    while (!this.shutdown) {
      const { Messages: messages = [] } = await this.queue.client.send(
        new ReceiveMessageCommand({
          QueueUrl: this.queue.queueUrl,
          MaxNumberOfMessages: 10,
          WaitTimeSeconds: 20,
        }),
      )

      this.currentBatchProcessing = this.handleMessageBatch(messages)
      await this.currentBatchProcessing
    }
  }

  private async handleMessageBatch(messages: SqsMessage[]) {
    this.logger.debug(`Processing ${messages.length} message(s)`)

    const results: boolean[] = await Promise.all(
      messages.map(async (msg) => {
        try {
          await this.messageHandler.process(JSON.parse(msg.Body ?? ''))
          return true
        } catch (e) {
          this.logger.warn(e)
          return false
        }
      }),
    )

    const failures = messages.filter((_, i) => !results[i])
    this.logger.warn('Failed processing messages', failures)

    const successful = messages.filter((_, i) => results[i])
    await this.deleteMessageBatch(successful)
  }

  private async deleteMessageBatch(messages: SqsMessage[]) {
    if (messages.length === 0) return

    this.logger.debug(`Confirming delivery of ${messages.length} message(s)`)

    await this.queue.client.send(
      new DeleteMessageBatchCommand({
        QueueUrl: this.queue.queueUrl,
        Entries: messages.map((msg) => ({
          Id: msg.MessageId,
          ReceiptHandle: msg.ReceiptHandle,
        })),
      }),
    )
  }
}
