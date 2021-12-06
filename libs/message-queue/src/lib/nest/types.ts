import { SQSClientConfig } from '@aws-sdk/client-sqs'

export interface DeadLetterQueue {
  name?: string
  messageRetentionPeriod?: number
}

export interface Queue {
  name: string
  messageRetentionPeriod?: number
  visibilityTimeout?: number
  maxRecieveCount?: number
  deadLetterQueue?: DeadLetterQueue
}

export interface Config {
  client: SQSClientConfig
  queues: Record<string, Queue>
}
