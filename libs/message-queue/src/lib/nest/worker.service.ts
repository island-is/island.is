import assert from 'assert'
import { Injectable, OnModuleDestroy } from '@nestjs/common'
import {
  SQSClient,
  SQSClientConfig,
  Message,
  ReceiveMessageCommand,
  DeleteMessageBatchCommand,
} from '@aws-sdk/client-sqs'
import { Logger } from '@island.is/logging'
import { QueueService } from './queue.service'

enum Status {
  Idle,
  Running,
  Stopping,
  Stopped,
}

type MessageHandler = (hander: unknown) => Promise<void>

@Injectable()
export class WorkerService implements OnModuleDestroy {
  private client: SQSClient
  private activeJobs: Promise<void> | null = null
  private status = Status.Idle

  constructor(
    clientConfig: SQSClientConfig,
    private readonly queue: QueueService,
    private readonly logger: Logger,
  ) {
    this.client = new SQSClient(clientConfig)
  }

  async run(messageHandler: MessageHandler): Promise<void> {
    assert(
      this.status === Status.Idle,
      `Can not run worker with status: ${this.status}`,
    )

    this.logger.info('Starting worker')

    this.status = Status.Running
    while (this.status === Status.Running) {
      const { Messages: messages = [] } = await this.client.send(
        new ReceiveMessageCommand({
          QueueUrl: this.queue.url,
          MaxNumberOfMessages: 10,
          WaitTimeSeconds: 20,
        }),
      )

      this.activeJobs = this.handleMessageBatch(messages, messageHandler)
      await this.activeJobs
      this.activeJobs = null
    }
  }

  private async handleMessageBatch(
    messages: Message[],
    messageHandler: MessageHandler,
  ) {
    this.logger.debug(`Processing ${messages.length} message(s)`)

    const results: boolean[] = await Promise.all(
      messages.map(async (msg) => {
        try {
          await messageHandler(JSON.parse(msg.Body ?? ''))
          return true
        } catch (e) {
          this.logger.error(e)
          return false
        }
      }),
    )

    const successful = messages.filter((_, i) => results[i])
    await this.deleteMessageBatch(successful)
  }

  private async deleteMessageBatch(messages: Message[]) {
    if (messages.length === 0) return

    this.logger.debug(`Confirming delivery of ${messages.length} message(s)`)

    await this.client.send(
      new DeleteMessageBatchCommand({
        QueueUrl: this.queue.url,
        Entries: messages.map((msg) => ({
          Id: msg.MessageId,
          ReceiptHandle: msg.ReceiptHandle,
        })),
      }),
    )
  }

  async onModuleDestroy() {
    if (this.status === Status.Running) {
      this.logger.info('Stopping worker')

      if (this.activeJobs !== null) {
        this.logger.info('Waiting for workers to finish')
        this.status = Status.Stopping
        await this.activeJobs
      }

      this.status = Status.Stopped
    }

    this.client.destroy()
  }
}
