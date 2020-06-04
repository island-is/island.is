import * as AWS from 'aws-sdk'
import { Consumer } from 'sqs-consumer'

import { logger } from '@island.is/logging'

import { Message, RoutingKey } from './types'

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
    logger.info(`Declared exchange ${TopicArn}`)
    return TopicArn
  }

  async declareQueue({ name }: { name: string }) {
    const queueUrl = await this.getQueueUrl({ name })
    if (queueUrl) {
      logger.info(`Declared queue ${queueUrl}`)
      return queueUrl
    }

    const { QueueUrl } = await this.sqs
      .createQueue({
        QueueName: name,
      })
      .promise()

    logger.info(`Declared queue ${QueueUrl}`)
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
    logger.info(`Set queue ${dlQueueId} as dead letter queue for ${queueId}`)
  }

  async bindQueue({
    queueId,
    exchangeId,
    routingKeys = [],
  }: {
    queueId: string
    exchangeId: string
    routingKeys?: RoutingKey[]
  }) {
    const { QueueArn } = await this.getQueueAttributes({
      queueId,
      attributes: ['QueueArn'],
    })

    const { SubscriptionArn } = await this.sns
      .subscribe({
        Protocol: 'sqs',
        TopicArn: exchangeId,
        Endpoint: QueueArn,
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

    await this.sqs
      .setQueueAttributes({
        QueueUrl: queueId,
        Attributes: {
          Policy: `{
            "Statement": [{
              "Effect": "Allow",
              "Principal": "*",
              "Action":"sqs:SendMessage",
              "Resource": "${QueueArn}",
              "Condition": {
                "ArnEquals": {
                  "aws:SourceArn": "${exchangeId}"
                }
              }
            }]
          }`,
        },
      })
      .promise()

    logger.info(
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
    handler: (message: Message, routingKey: RoutingKey) => Promise<void>
  }) {
    const consumer = Consumer.create({
      queueUrl: queueId,
      handleMessage: async ({ Body }) => {
        const parsedBody = JSON.parse(Body)
        const { Message, MessageAttributes } = parsedBody
        const routingKey = MessageAttributes?.event_type?.Value
        const message = JSON.parse(Message)
        await handler(message, routingKey)
      },
    })

    consumer.on('error', (err) => {
      let msg = `Unexpected error on queue ${queueId}: ${err.message}`
      if (err.stack) {
        msg += `\n${err.stack}`
      }
      msg += '\nStopping Consumer'
      logger.error(msg)
      consumer.stop()
    })

    consumer.on('processing_error', (err) => {
      let msg = `Failed to process message on queue ${queueId}: ${err.message}`
      if (err.stack) {
        msg += `\n${err.stack}`
      }
      logger.error(msg)
    })

    consumer.start()
    return consumer
  }

  async publish({
    exchangeId,
    message,
    routingKey = undefined,
  }: {
    exchangeId: string
    message: Message
    routingKey?: RoutingKey
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
    logger.info(
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
