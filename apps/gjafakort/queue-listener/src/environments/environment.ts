export const environment = {
  production: false,
  awsRegion: 'eu-west-1',
  awsQueueUrl: 'http://localhost:4576/queue',
  awsQueueName: process.env.AWS_QUEUE_NAME,
}
