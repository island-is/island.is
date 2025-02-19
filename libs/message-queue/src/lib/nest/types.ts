import { SQSClientConfig } from '@aws-sdk/client-sqs'

export interface Queue {
  // internal nestjs identifier
  name: string
  // sqs queue name
  queueName: string
  // maximum concurrent async jobs processing messages from queue
  maxConcurrentJobs?: number
  // If a message hasn't been processed for this amount of time it will be
  // discarded
  messageRetentionPeriod?: number
  // If a message isn't acknowledged for this amount of time after delivery it
  // will be re-inserted into the queue
  visibilityTimeout?: number
  // If a message delivery fails (isn't acknowledged) `maxReceiveCount` times it
  // will be moved to the dead letter queue for inspection/debugging
  maxReceiveCount?: number
  // define a dead-letter queue for messages that fail processing repeatedly
  deadLetterQueue?: DeadLetterQueue
  // if true, the worker will sleep during the night
  shouldSleepOutsideWorkingHours?: boolean
}

export interface DeadLetterQueue {
  // name of dead letter queue in aws - default generated from main queue name
  queueName?: string
  // how long to keep messages in the dead letter queue before being deleted
  messageRetentionPeriod?: number
}

export interface Config {
  client: SQSClientConfig
  queue: Queue
}

export interface Job {
  id: string
}
