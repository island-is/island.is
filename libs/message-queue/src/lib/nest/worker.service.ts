import assert from 'assert'
import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { Message } from '@aws-sdk/client-sqs'
import type { Logger } from '@island.is/logging'
import { QueueService } from './queue.service'
import type { Queue, Job } from './types'
import { clamp } from './utils'
import { ClientService } from './client.service'

type MessageHandler<T> = (handler: T, job: Job) => Promise<void>

// These limits are enforced by AWS, although we could possibly work around the
// max limit by running multiple listeners simultaneously
const MIN_BATCH_SIZE = 1
const MAX_BATCH_SIZE = 10
const DEFAULT_BATCH_SIZE = 10

enum Status {
  Idle,
  Running,
  Stopping,
  Stopped,
}

@Injectable()
export class WorkerService implements OnModuleDestroy {
  private activeJobs: Promise<void> | null = null
  private status = Status.Idle

  constructor(
    private config: Queue,
    private client: ClientService,
    private queue: QueueService,
    private logger: Logger,
  ) {}

  async run<T>(messageHandler: MessageHandler<T>): Promise<void> {
    assert(
      this.status === Status.Idle,
      `Can not run worker with status: ${this.status}`,
    )

    const concurrency = this.getConcurrency()
    this.logger.info(
      `Starting worker "${this.config.name}" with concurrency=${concurrency}`,
    )

    this.status = Status.Running
    while (this.status === Status.Running) {
      const messages = await this.client.receiveMessages(this.queue.url, {
        maxNumMessages: this.config.maxConcurrentJobs,
      })

      this.activeJobs = this.handleMessageBatch(messages, messageHandler)
      await this.activeJobs
      this.activeJobs = null
    }
  }

  private getConcurrency(): number {
    const concurrency = this.config.maxConcurrentJobs ?? DEFAULT_BATCH_SIZE

    if (concurrency < MIN_BATCH_SIZE || concurrency > MAX_BATCH_SIZE) {
      this.logger.warn(
        `Queue config "maxConcurrentJobs" should be between ${MIN_BATCH_SIZE} and ${MAX_BATCH_SIZE} - Got ${concurrency}`,
      )
    }

    return clamp(concurrency, MIN_BATCH_SIZE, MAX_BATCH_SIZE)
  }

  private async handleMessageBatch<T>(
    messages: Message[],
    messageHandler: MessageHandler<T>,
  ) {
    this.logger.info(
      `Processing ${messages.length} message${messages.length > 1 ? 's' : ''}`,
      {
        messageIds: messages.map((msg) => msg.MessageId),
        institutions: messages.map((msg) => msg.Attributes?.institution),
      },
    )

    const results: boolean[] = await Promise.all(
      messages.map(async (msg) => {
        try {
          assert(msg.MessageId, 'Unexpected empty message id')
          const job: Job = { id: msg.MessageId }
          await messageHandler(JSON.parse(msg.Body ?? ''), job)
          return true
        } catch (e) {
          this.logger.error('Worker exception', e, { messageId: msg.MessageId })
          return false
        }
      }),
    )

    const successful = messages.filter((_, i) => results[i])
    await this.deleteMessageBatch(successful)
  }

  private async deleteMessageBatch(messages: Message[]) {
    if (messages.length === 0) return

    this.logger.info(`Confirming delivery of ${messages.length} message(s)`)
    await this.client.deleteMessages(this.queue.url, messages)
  }

  async onModuleDestroy() {
    if (this.status === Status.Running) {
      this.logger.info(`Stopping worker "${this.config.name}"`)

      if (this.activeJobs !== null) {
        this.logger.info('Waiting for active jobs to finish')
        this.status = Status.Stopping
        await this.activeJobs
      }

      this.status = Status.Stopped
    }
  }
}
