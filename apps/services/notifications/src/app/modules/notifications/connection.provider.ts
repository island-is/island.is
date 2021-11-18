import assert from 'assert'
import {
  SQSClient,
  SQSClientConfig,
  CreateQueueCommand,
  GetQueueAttributesCommand,
} from '@aws-sdk/client-sqs'
import { SqsChannel } from '../../../types'

const minute = 60
const hour = minute * 60
const day = hour * 24

export const createQueue = async ({
  mainQueueName,
  deadLetterQueueName,
  sqsConfig,
}: {
  mainQueueName: string
  deadLetterQueueName: string
  sqsConfig: SQSClientConfig
}): Promise<SqsChannel> => {
  const client = new SQSClient(sqsConfig)

  // Create a dead letter queue
  // https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html
  const deadLetterQueue = await client.send(
    new CreateQueueCommand({
      QueueName: deadLetterQueueName,
      Attributes: {
        MessageRetentionPeriod: (day * 14).toString(),
      },
    }),
  )

  // Fetch arn of the dead letter queue
  const deadLetterQueueAttrs = await client.send(
    new GetQueueAttributesCommand({
      QueueUrl: deadLetterQueue.QueueUrl,
      AttributeNames: ['QueueArn'],
    }),
  )

  const deadLetterTargetArn = deadLetterQueueAttrs.Attributes?.QueueArn
  assert(deadLetterTargetArn)

  // Create the main queue
  const mainQueue = await client.send(
    new CreateQueueCommand({
      QueueName: mainQueueName,
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

  const queueUrl = mainQueue.QueueUrl
  assert(queueUrl)

  return { client, queueUrl }
}
