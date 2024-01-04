import { processJob } from '@island.is/infra-nest-server'

let env = process.env

const isDevelopment = env.NODE_ENV === 'development'

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
  contentfulAccessToken: env.CONTENTFUL_ACCESS_TOKEN,
  auth: {
    issuer:
      env.IDENTITY_SERVER_ISSUER_URL ??
      'https://identity-server.dev01.devland.is',
  },

  emailOptions: isDevelopment
    ? {
        useTestAccount: true,
        useNodemailerApp: env.USE_NODEMAILER_APP === 'true' ?? false,
      }
    : {
        useTestAccount: false,
        options: {
          region: env.EMAIL_REGION ?? 'eu-west-1',
        },
      },
}

export type Config = typeof environment
