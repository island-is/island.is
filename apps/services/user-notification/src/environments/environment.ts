import { processJob } from '@island.is/infra-nest-server'

let env = process.env

if (!env.NODE_ENV || env.NODE_ENV === 'development') {
  env = {
    MAIN_QUEUE_NAME: 'notifications',
    DEAD_LETTER_QUEUE_NAME: 'notifications-failure',
    SQS_REGION: 'eu-west-1',
    SQS_ENDPOINT: 'http://localhost:4566',
    SQS_ACCESS_KEY: 'testing',
    SQS_SECRET_ACCESS_KEY: 'testing',
    USER_NOTIFICATION_APP_PROTOCOL: 'is.island.app.dev',
    ...env,
  }
}

const required = (name: string): string => env[name] ?? ''

const job = processJob()

export const environment = {
  identityServerPath: required('IDENTITY_SERVER_PATH'),
  userProfileServiceBasePath: required('SERVICE_USER_PROFILE_BASEPATH'),
  notificationsClientId: required('USER_NOTIFICATION_CLIENT_ID'),
  notificationsClientSecret: required('USER_NOTIFICATION_CLIENT_SECRET'),

  appProtocol: required('USER_NOTIFICATION_APP_PROTOCOL'),

  isWorker: job === 'worker',

  firebaseCredentials: required('FIREBASE_CREDENTIALS'),

  mainQueueName: required('MAIN_QUEUE_NAME'),
  deadLetterQueueName: env.DEAD_LETTER_QUEUE_NAME,

  sqsConfig: {
    endpoint: env.SQS_ENDPOINT,
    region: env.SQS_REGION,
    ...(env.SQS_ACCESS_KEY &&
      env.SQS_SECRET_ACCESS_KEY && {
        credentials: {
          accessKeyId: env.SQS_ACCESS_KEY,
          secretAccessKey: env.SQS_SECRET_ACCESS_KEY,
        },
      }),
  },
  contentfulAccessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
}

export type Config = typeof environment
