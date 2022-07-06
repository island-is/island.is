import assert from 'assert'
import { Injectable } from '@nestjs/common'
import {
  SQSClient,
  SQSClientConfig,
  CreateQueueCommand,
  DeleteMessageBatchCommand,
  GetQueueAttributesCommand,
  GetQueueUrlCommand,
  PurgeQueueCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SetQueueAttributesCommand,
  Message,
} from '@aws-sdk/client-sqs'
import type { Logger } from '@island.is/logging'

@Injectable()
export class ClientService {
  private client: SQSClient

  constructor(config: SQSClientConfig, private logger: Logger) {
    this.client = new SQSClient(config)
  }

  async add(url: string, message: unknown): Promise<string> {
    const r = await this.client.send(
      new SendMessageCommand({
        QueueUrl: url,
        MessageAttributes: {},
        MessageBody: JSON.stringify(message),
      }),
    )

    assert(r.MessageId, 'Unexpected empty message id')
    return r.MessageId
  }

  async purge(url: string): Promise<void> {
    await this.client.send(
      new PurgeQueueCommand({
        QueueUrl: url,
      }),
    )
  }

  async receiveMessages(url: string, { maxNumMessages = 10 } = {}) {
    const { Messages: messages = [] } = await this.client.send(
      new ReceiveMessageCommand({
        QueueUrl: url,
        MaxNumberOfMessages: maxNumMessages, // max allowed = 10
        WaitTimeSeconds: 20, // max allowed = 20
      }),
    )

    return messages
  }

  async deleteMessages(url: string, messages: Message[]) {
    await this.client.send(
      new DeleteMessageBatchCommand({
        QueueUrl: url,
        Entries: messages.map((msg) => ({
          Id: msg.MessageId,
          ReceiptHandle: msg.ReceiptHandle,
        })),
      }),
    )
  }

  async getQueueAttributes(
    url: string,
    attributes: string[],
  ): Promise<Record<string, string>> {
    const r = await this.client.send(
      new GetQueueAttributesCommand({
        QueueUrl: url,
        AttributeNames: attributes,
      }),
    )
    return r.Attributes ?? {}
  }

  async createOrUpdateQueue(
    name: string,
    attributes: Record<string, string>,
  ): Promise<string> {
    const url = await this.tryGetQueueUrl(name)

    if (url) {
      await this.syncQueueAttributes(name, url, attributes)
      return url
    }

    this.logger.info(`Creating queue "${name}"`)

    const queue = await this.client.send(
      new CreateQueueCommand({
        QueueName: name,
        Attributes: attributes,
      }),
    )

    assert(queue.QueueUrl, 'Unexpected empty QueueUrl')
    return queue.QueueUrl
  }

  async tryGetQueueUrl(name: string): Promise<string | void> {
    try {
      const queue = await this.client.send(
        new GetQueueUrlCommand({
          QueueName: name,
        }),
      )
      assert(queue.QueueUrl, 'Unexpected empty QueueUrl')
      return queue.QueueUrl
    } catch (e) {
      if (!e || e.Code !== 'AWS.SimpleQueueService.NonExistentQueue') {
        throw e
      }
    }
  }

  async syncQueueAttributes(
    name: string,
    url: string,
    attributes: Record<string, string>,
  ): Promise<void> {
    const current = await this.getQueueAttributes(url, Object.keys(attributes))

    const areNotEqual = (k: string) => attributes[k] !== current[k]
    if (Object.keys(attributes).some(areNotEqual)) {
      this.logger.debug(`Updating "${name}" queue attributes`, attributes)

      await this.client.send(
        new SetQueueAttributesCommand({
          QueueUrl: url,
          Attributes: attributes,
        }),
      )
    }
  }
}
