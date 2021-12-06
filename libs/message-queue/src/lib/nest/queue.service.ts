import assert from 'assert'
import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import {
  SQSClient,
  SQSClientConfig,
  CreateQueueCommand,
  GetQueueAttributesCommand,
  SendMessageCommand,
} from '@aws-sdk/client-sqs'
import { DAY, MINUTE } from './constants'
import { Queue } from './types'

@Injectable()
export class QueueService implements OnApplicationBootstrap {
  private client: SQSClient
  private _url = ''

  constructor(clientConfig: SQSClientConfig, private queueConfig: Queue) {
    this.client = new SQSClient(clientConfig)
  }

  get url(): string {
    assert(
      this._url,
      'Can not use queue until nest-js application bootstrapping has finished',
    )

    return this._url
  }

  async add(msg: unknown): Promise<string> {
    const r = await this.client.send(
      new SendMessageCommand({
        MessageAttributes: {},
        MessageBody: JSON.stringify(msg),
        QueueUrl: this.url,
      }),
    )

    assert(r.MessageId, 'Unexpected empty message id')
    return r.MessageId
  }

  // NB: We initialize the queues using "onApplicationBootstrap" rather than an
  // async "useFactory" because initializing the the nest application (like the
  // openapi generator does at the time of writing this) initializes all
  // factories, but we don't want to connect to the queue server unless we're
  // actually going to run the application
  // https://docs.nestjs.com/fundamentals/lifecycle-events
  async onApplicationBootstrap() {
    this._url = await this.createMainQueue()
  }

  private async createMainQueue(): Promise<string> {
    const deadLetterTargetArn = await this.createDeadLetterQueue()

    const mainQueue = await this.client.send(
      new CreateQueueCommand({
        QueueName: this.queueConfig.name,
        Attributes: {
          // If a message hasn't been processed for this amount of time it will
          // be discarded (or moved to dead letter queue?)
          MessageRetentionPeriod: (
            this.queueConfig.messageRetentionPeriod ?? DAY * 7
          ).toString(),
          // If a message isn't acknowledged for this amount of time after
          // delivery it will be re-inserted into the queue
          VisibilityTimeout: (
            this.queueConfig.visibilityTimeout ?? MINUTE * 10
          ).toString(),
          // If a message delivery fails `maxReceiveCount` times it will be
          // moved to the dead letter queue for inspection/debugging
          ...(deadLetterTargetArn && {
            RedrivePolicy: JSON.stringify({
              maxReceiveCount: this.queueConfig.maxRecieveCount ?? 3,
              deadLetterTargetArn,
            }),
          }),
        },
      }),
    )

    assert(mainQueue.QueueUrl)
    return mainQueue.QueueUrl
  }

  private async createDeadLetterQueue(): Promise<string | null> {
    if (!this.queueConfig.deadLetterQueue) return null

    // create the dead letter queue
    const deadLetterQueue = await this.client.send(
      new CreateQueueCommand({
        QueueName:
          this.queueConfig.deadLetterQueue.name ??
          `${this.queueConfig.name}-dead-letters`,
        Attributes: {
          MessageRetentionPeriod: (
            this.queueConfig.deadLetterQueue.messageRetentionPeriod ?? DAY * 14
          ).toString(),
        },
      }),
    )

    // Fetch arn of the dead letter queue
    const deadLetterQueueAttrs = await this.client.send(
      new GetQueueAttributesCommand({
        QueueUrl: deadLetterQueue.QueueUrl,
        AttributeNames: ['QueueArn'],
      }),
    )

    const arn = deadLetterQueueAttrs.Attributes?.QueueArn
    assert(arn)
    return arn
  }
}
