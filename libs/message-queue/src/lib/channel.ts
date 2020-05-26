import * as AWS from 'aws-sdk'
import { Consumer } from 'sqs-consumer'
import { Message } from './types'

AWS.config.update({ region: 'eu-west-1' })

const SNS_LOCALSTACK_ENDPOINT = 'http://localhost:4575'
const SQS_LOCALSTACK_ENDPOINT = 'http://localhost:4576'

class Channel {
  sns: AWS.SNS
  sqs: AWS.SQS

  constructor(production: boolean) {
    this.sns = new AWS.SNS({
      apiVersion: '2010-03-31',
      endpoint: production ? undefined : SNS_LOCALSTACK_ENDPOINT,
    })

    this.sqs = new AWS.SQS({
      apiVersion: '2012-11-05',
      endpoint: production ? undefined : SQS_LOCALSTACK_ENDPOINT,
    })
  }

  async declareExchange({ name }: { name: string }) {
    const { TopicArn } = await this.sns.createTopic({ Name: name }).promise()
    console.log(`Declared exchange ${TopicArn}`)
    return TopicArn
  }

  async declareQueue({ name }: { name: string }) {
    const queueUrl = await this.getQueueUrl({ name })
    if (queueUrl) {
      console.log(`Declared queue ${queueUrl}`)
      return queueUrl
    }

    const { QueueUrl } = await this.sqs
      .createQueue({
        QueueName: name,
      })
      .promise()

    console.log(`Declared queue ${QueueUrl}`)
    return QueueUrl
  }

  async setDlQueue({
    queueId,
    dlQueueId,
    maxReceiveCount = 5,
  }: {
    queueId: string
    dlQueueId: string
    maxReceiveCount?: number
  }) {
    const { QueueArn } = await this.getQueueAttributes({
      queueId: dlQueueId,
      attributes: ['QueueArn'],
    })

    await this.sqs
      .setQueueAttributes({
        QueueUrl: queueId,
        Attributes: {
          RedrivePolicy: `{"deadLetterTargetArn": "${QueueArn}", "maxReceiveCount": ${maxReceiveCount}}`,
        },
      })
      .promise()
    console.log(`Set queue ${dlQueueId} as dead letter queue for ${queueId}`)
  }

  async bindQueue({
    queueId,
    exchangeId,
    routingKeys = [],
  }: {
    queueId: string
    exchangeId: string
    routingKeys?: string[]
  }) {
    const { SubscriptionArn } = await this.sns
      .subscribe({
        Protocol: 'sqs',
        TopicArn: exchangeId,
        Endpoint: queueId,
      })
      .promise()

    if (routingKeys.length > 0) {
      await this.sns
        .setSubscriptionAttributes({
          SubscriptionArn,
          AttributeName: 'FilterPolicy',
          AttributeValue: `{"event_type": ["${routingKeys.join('", "')}"]}`,
        })
        .promise()
    }

    console.log(
      `Bound queue ${queueId} to exchange ${exchangeId} with routingKeys: ${routingKeys.join(
        ', ',
      )}.`,
    )
    return SubscriptionArn
  }

  consume({
    queueId,
    handler,
  }: {
    queueId: string
    handler: (message: Message) => Promise<void>
  }) {
    const app = Consumer.create({
      queueUrl: queueId,
      handleMessage: async ({ Body }) => {
        const parsedBody = JSON.parse(Body)
        const message = JSON.parse(parsedBody.Message)
        handler(message)
      },
    })

    app.on('error', (err) => {
      console.error('Unexpected error', err.message)
    })

    app.on('processing_error', (err) => {
      console.error('Failed processing message', err.message)
    })

    app.start()
  }

  async publish({
    exchangeId,
    message,
    routingKey = undefined,
  }: {
    exchangeId: string
    message: Message
    routingKey?: string
  }) {
    const params = {
      Message: JSON.stringify(message),
      TopicArn: exchangeId,
    }
    if (routingKey) {
      params['MessageAttributes'] = {
        // eslint-disable-next-line
        event_type: {
          DataType: 'String',
          StringValue: routingKey,
        },
      }
    }
    const { MessageId } = await this.sns.publish(params).promise()
    console.log(
      `Published message ${MessageId} to ${exchangeId} with routingKey ${routingKey}`,
    )
    return MessageId
  }

  private async getQueueUrl({ name }: { name: string }) {
    try {
      const { QueueUrl } = await this.sqs
        .getQueueUrl({ QueueName: name })
        .promise()
      return QueueUrl
    } catch (err) {
      return undefined
    }
  }

  private async getQueueAttributes({
    queueId,
    attributes,
  }: {
    queueId: string
    attributes: string[]
  }) {
    const { Attributes } = await this.sqs
      .getQueueAttributes({
        QueueUrl: queueId,
        AttributeNames: attributes,
      })
      .promise()
    return Attributes
  }
}

export default Channel
