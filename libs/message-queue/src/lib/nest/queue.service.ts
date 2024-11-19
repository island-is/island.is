import assert from 'assert'
import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { ClientService } from './client.service'
import { DAY, MINUTE } from './time'
import type { Queue } from './types'

@Injectable()
export class QueueService implements OnApplicationBootstrap {
  private _url: string | null = null

  constructor(private client: ClientService, private config: Queue) {}

  // NB: We initialize the queues using "onApplicationBootstrap" rather than an
  // async "useFactory" because creating the nest application (like the
  // openapi generator does at the time of writing) initializes all
  // factories, but we don't want to attempt connecting to the queue server
  // unless we're actually going to run the application
  // https://docs.nestjs.com/fundamentals/lifecycle-events
  async onApplicationBootstrap() {
    this._url = await this.createMainQueue()
  }

  get url(): string {
    assert(
      this._url,
      'Can not use queue until nest application bootstrapping has finished',
    )

    return this._url
  }

  // Add new message to queue.
  async add(
    message: unknown,
    messageAttributes?: Record<string, { DataType: string; StringValue: string }>,
  ): Promise<string> {
    return await this.client.add(this.url, message, messageAttributes)
  }

  // Purge all messages from queue. This is probably mainly useful in test
  // suites to make sure no leftover messages break tests that are about to run.
  async purge() {
    await this.client.purge(this.url)
  }

  private async createMainQueue(): Promise<string> {
    const deadLetterTargetArn = await this.createDeadLetterQueue()

    return await this.client.createOrUpdateQueue(this.config.queueName, {
      MessageRetentionPeriod: (
        this.config.messageRetentionPeriod ?? DAY * 7
      ).toString(),
      VisibilityTimeout: (
        this.config.visibilityTimeout ?? MINUTE * 10
      ).toString(),
      ...(deadLetterTargetArn && {
        RedrivePolicy: JSON.stringify({
          maxReceiveCount: this.config.maxReceiveCount ?? 3,
          deadLetterTargetArn,
        }),
      }),
    })
  }

  private async createDeadLetterQueue(): Promise<string | void> {
    if (!this.config.deadLetterQueue) return

    const url = await this.client.createOrUpdateQueue(
      this.config.deadLetterQueue.queueName ??
        `${this.config.queueName}-failed`,

      {
        MessageRetentionPeriod: (
          this.config.deadLetterQueue.messageRetentionPeriod ?? DAY * 14
        ).toString(),
      },
    )

    // AWS doesn't return the Arn when creating the queue, which we need to be
    // able to make it a dead letter queue,
    const { QueueArn: arn } = await this.client.getQueueAttributes(url, [
      'QueueArn',
    ])

    assert(arn, 'Unexpected empty QueueArn')
    return arn
  }
}
