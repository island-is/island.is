export const environment = {
  production: false,

  mainQueueName: 'notifications',
  deadLetterQueueName: 'notifications-failure',

  sqsConfig: {
    region: 'eu-west-1',
    endpoint: 'http://localhost:4566',
    credentials: {
      accessKeyId: 'testing',
      secretAccessKey: 'testing',
    },
  },
}
