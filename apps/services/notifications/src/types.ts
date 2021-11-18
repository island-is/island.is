import { SQSClient } from '@aws-sdk/client-sqs'

export interface SqsChannel {
  client: SQSClient
  queueUrl: string
}
