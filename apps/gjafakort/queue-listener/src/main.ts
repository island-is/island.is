import AWS from 'aws-sdk'
import { Consumer } from 'sqs-consumer'
import { environment } from './environments/environment'
import queueHandlers from './queue-handlers'

if (Object.keys(queueHandlers).includes(environment.awsQueueName)) {
  AWS.config.update({ region: environment.awsRegion })

  const app = Consumer.create({
    queueUrl: `${environment.awsQueueUrl}/${environment.awsQueueName}`,
    handleMessage: queueHandlers[environment.awsQueueName],
    sqs: new AWS.SQS(),
  })

  app.on('error', (err) => {
    console.error('Unexpected error', err.message)
  })

  app.on('processing_error', (err) => {
    console.error('Failed processing message', err.message)
  })

  app.start()
} else {
  console.error(
    '\x1b[31m%s\x1b[0m',
    `FATAL ERROR: environment variable AWS_QUEUE_NAME must be one of [${Object.keys(
      queueHandlers,
    )}]`,
  )
  process.exit(1)
}
