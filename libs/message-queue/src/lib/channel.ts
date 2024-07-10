import {
  SQSClient,
  CreateQueueCommand,
  GetQueueUrlCommand,
  SetQueueAttributesCommand,
  GetQueueAttributesCommand,
  QueueAttributeName,
} from '@aws-sdk/client-sqs'
import {
  CreateTopicCommand,
  PublishCommand,
  PublishCommandInput,
  SetSubscriptionAttributesCommand,
  SNSClient,
  SubscribeCommand,
} from '@aws-sdk/client-sns'
import { Consumer } from 'sqs-consumer'
import { Message } from '@aws-sdk/client-sqs'

import { logger } from '@island.is/logging'

const SNS_LOCALSTACK_ENDPOINT =
  process.env.SNS_ENDPOINT ?? 'http://localhost:4566'
const SQS_LOCALSTACK_ENDPOINT =
  process.env.SQS_ENDPOINT ?? 'http://localhost:4566'

class Channel {
  sns: SNSClient
  sqs: SQSClient

  constructor(isProduction: boolean) {
    this.sns = new SNSClient({
      endpoint: isProduction ? undefined : SNS_LOCALSTACK_ENDPOINT,
    })

    this.sqs = new SQSClient({
      endpoint: isProduction ? undefined : SQS_LOCALSTACK_ENDPOINT,
    })
  }

  async declareExchange({ name }: { name: string }) {
    const cmd = new CreateTopicCommand({ Name: name })
    const { TopicArn } = await this.sns.send(cmd)
    logger.info(`Declared exchange ${TopicArn}`)
    return TopicArn
  }

  async declareQueue({ name }: { name: string }) {
    const queueUrl = await this.getQueueUrl({ name })
    if (queueUrl) {
      logger.info(`Declared queue ${queueUrl}`)
      return queueUrl
    }

    const command = new CreateQueueCommand({ QueueName: name })
    const { QueueUrl } = await this.sqs.send(command)

    if (!QueueUrl) {
      throw new Error(`Failed to create queue ${name}`)
    }

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

    const command = new SetQueueAttributesCommand({
      QueueUrl: queueId,
      Attributes: {
        RedrivePolicy: JSON.stringify({
          deadLetterTargetArn: QueueArn,
          maxReceiveCount: maxReceiveCount,
        }),
      },
    })
    await this.sqs.send(command)
    logger.info(`Set queue ${dlQueueId} as dead letter queue for ${queueId}`)
  }

  async bindQueue<K>({
    queueId,
    exchangeId,
    routingKeys = [],
  }: {
    queueId: string
    exchangeId: string
    routingKeys?: K[]
  }) {
    const { QueueArn } = await this.getQueueAttributes({
      queueId,
      attributes: ['QueueArn'],
    })

    const { SubscriptionArn } = await this.sns.send(
      new SubscribeCommand({
        Protocol: 'sqs',
        TopicArn: exchangeId,
        Endpoint: QueueArn,
      }),
    )
    if (!SubscriptionArn) {
      throw new Error(`Unable to subscribe to SNS exchange ${exchangeId}`)
    }

    if (routingKeys.length > 0) {
      await this.sns.send(
        new SetSubscriptionAttributesCommand({
          SubscriptionArn,
          AttributeName: 'FilterPolicy',
          AttributeValue: `{"event_type": ["${routingKeys.join('", "')}"]}`,
        }),
      )
    }

    const setQueueAttributesCommand = new SetQueueAttributesCommand({
      QueueUrl: queueId,
      Attributes: {
        Policy: JSON.stringify({
          Statement: [
            {
              Effect: 'Allow',
              Principal: '*',
              Action: 'sqs:SendMessage',
              Resource: QueueArn,
              Condition: {
                ArnEquals: {
                  'aws:SourceArn': exchangeId,
                },
              },
            },
          ],
        }),
      },
    })
    await this.sqs.send(setQueueAttributesCommand)

    logger.info(
      `Bound queue ${queueId} to exchange ${exchangeId} with routingKeys: ${routingKeys.join(
        ', ',
      )}.`,
    )
    return SubscriptionArn
  }

  consume<M, K>({
    queueId,
    messageHandler,
    errorHandler,
  }: {
    queueId: string
    messageHandler: (message: M, routingKey: K) => Promise<void>
    errorHandler?: (error: unknown) => void
  }) {
    const parseMessage = (
      sqsMessage: Message,
    ): {
      message: M
      routingKey: K
    } => {
      if (!sqsMessage.Body) {
        logger.error(`No Body found on sqs message!`, sqsMessage)
        throw new Error(`No Body found on sqs message!`)
      }
      const parsedBody = JSON.parse(sqsMessage.Body)
      const { Message, MessageAttributes } = parsedBody
      const routingKey = MessageAttributes?.event_type?.Value
      const message = JSON.parse(Message)
      return {
        message,
        routingKey,
      }
    }
    const consumer = Consumer.create({
      queueUrl: queueId,
      handleMessage: async (sqsMessage) => {
        const { message, routingKey } = parseMessage(sqsMessage)
        await messageHandler(message, routingKey)
      },
    })

    consumer.on('error', (err) => {
      let msg = `Unexpected error on queue ${queueId}: ${err.message}`
      if (err.stack) {
        msg += `\n${err.stack}`
      }
      msg += '\nStopping Consumer'
      logger.error(msg)
      if (errorHandler) {
        errorHandler(err)
      }
      consumer.stop()
    })

    consumer.on('processing_error', (err, sqsMessage) => {
      const { routingKey } = parseMessage(sqsMessage)
      let msg = `Failed to process message on queue ${queueId} with routingKey ${routingKey}: ${err.message}`
      if (err.stack) {
        msg += `\n${err.stack}`
      }
      logger.error(msg)
      if (errorHandler) {
        errorHandler(err)
      }
    })

    consumer.start()
    return consumer
  }

  async publish<M, K extends string>({
    exchangeId,
    message,
    routingKey = undefined,
  }: {
    exchangeId: string
    message: M
    routingKey?: K
  }) {
    const params: PublishCommandInput = {
      Message: JSON.stringify(message),
      TopicArn: exchangeId,
    }
    if (routingKey) {
      params['MessageAttributes'] = {
        event_type: {
          DataType: 'String',
          StringValue: routingKey,
        },
      }
    }
    const { MessageId } = await this.sns.send(new PublishCommand(params))
    logger.info(
      `Published message ${MessageId} to ${exchangeId} with routingKey ${routingKey}`,
    )
    return MessageId
  }

  private async getQueueUrl({ name }: { name: string }) {
    try {
      const command = new GetQueueUrlCommand({ QueueName: name })
      const { QueueUrl } = await this.sqs.send(command)
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
    attributes: QueueAttributeName[]
  }) {
    const command = new GetQueueAttributesCommand({
      QueueUrl: queueId,
      AttributeNames: attributes,
    })
    const { Attributes } = await this.sqs.send(command)
    if (!Attributes) {
      throw new Error(`Unable to get queue attributes for queue ${queueId}`)
    }
    return Attributes
  }
}

export default Channel
