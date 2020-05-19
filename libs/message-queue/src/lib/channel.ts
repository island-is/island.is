import AWS from 'aws-sdk'
import { Consumer } from 'sqs-consumer'

AWS.config.update({ region: 'eu-west-1' })

const SNS_LOCALSTACK_ENDPOINT = 'http://localhost:4575'
const SQS_LOCALSTACK_ENDPOINT = 'http://localhost:4576'

class Channel {
  sns: any
  sqs: any

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

  async declareExchange({ name }) {
    const { TopicArn } = await this.sns.createTopic({ Name: name }).promise()
    console.log(`Declared exchange ${TopicArn}`)
    return TopicArn
  }

  async declareQueue({ name }) {
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

  async setDlQueue({ queueId, dlQueueId, maxReceiveCount = 5 }) {
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

  async bindQueue({ queueId, exchangeId, routingKeys = [] }) {
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

  consume({ queueId, handler }) {
    const app = Consumer.create({
      queueUrl: queueId,
      handleMessage: handler,
    })

    app.on('error', (err) => {
      console.error('Unexpected error', err.message)
    })

    app.on('processing_error', (err) => {
      console.error('Failed processing message', err.message)
    })

    app.start()
  }

  async publish({ exchangeId, message, routingKey = undefined }) {
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
  }

  private async getQueueUrl({ name }) {
    try {
      const { QueueUrl } = await this.sqs
        .getQueueUrl({ QueueName: name })
        .promise()
      return QueueUrl
    } catch (err) {
      return undefined
    }
  }

  private async getQueueAttributes({ queueId, attributes = [] }) {
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
