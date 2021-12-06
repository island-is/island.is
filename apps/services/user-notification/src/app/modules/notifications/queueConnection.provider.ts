import assert from 'assert'
import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common'
import {
  SQSClient,
  CreateQueueCommand,
  GetQueueAttributesCommand,
} from '@aws-sdk/client-sqs'
import type { Config } from '../../../environments/environment'
import { CONFIG_PROVIDER } from '../../../constants'

const minute = 60
const hour = minute * 60
const day = hour * 24

@Injectable()
export class QueueConnectionProvider implements OnApplicationBootstrap {
  public client!: SQSClient
  public queueUrl!: string

  constructor(
    @Inject(CONFIG_PROVIDER)
    private readonly config: Config,
  ) {}

  async onApplicationBootstrap() {
    this.client = new SQSClient(this.config.sqsConfig)

    // Create a dead letter queue
    // https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html
    const deadLetterQueue = await this.client.send(
      new CreateQueueCommand({
        QueueName: this.config.deadLetterQueueName,
        Attributes: {
          MessageRetentionPeriod: (day * 14).toString(),
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

    const deadLetterTargetArn = deadLetterQueueAttrs.Attributes?.QueueArn
    assert(deadLetterTargetArn)

    // Create the main queue
    const mainQueue = await this.client.send(
      new CreateQueueCommand({
        QueueName: this.config.mainQueueName,
        Attributes: {
          // If a message hasn't been processed for this amount of time it will
          // be discarded (or moved to dead letter queue?)
          MessageRetentionPeriod: (day * 7).toString(),
          // If a message isn't acknowledged for this amount of time after
          // delivery it will be re-inserted into the queue
          VisibilityTimeout: (minute * 10).toString(),
          // If a message delivery fails `maxReceiveCount` times it will be
          // moved to the dead letter queue for inspection/debugging
          RedrivePolicy: JSON.stringify({
            maxReceiveCount: 3,
            deadLetterTargetArn,
          }),
        },
      }),
    )

    assert(mainQueue.QueueUrl)
    this.queueUrl = mainQueue.QueueUrl
  }
}
