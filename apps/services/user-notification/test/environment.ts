export const environment = {
  MAIN_QUEUE_NAME: 'test-main',
  DEAD_LETTER_QUEUE_NAME: 'test-failure',
  EMAIL_QUEUE_NAME: 'test-email',
  EMAIL_DEAD_LETTER_QUEUE_NAME: 'test-email-failure',
  SMS_QUEUE_NAME: 'test-sms',
  SMS_DEAD_LETTER_QUEUE_NAME: 'test-sms-failure',
  PUSH_QUEUE_NAME: 'test-push',
  PUSH_DEAD_LETTER_QUEUE_NAME: 'test-push-failure',
  SQS_REGION: 'eu-west-1',
  SQS_ACCESS_KEY: 'testing',
  SQS_SECRET_ACCESS_KEY: 'testing',
  SERVICE_PORTAL_CLICK_ACTION_URL: 'https://island.is/minarsidur',
  SERVICE_PORTAL_BFF_LOGIN_URL: 'https://island.is/bff/login',
  // Disable redis registration during testing
  REDIS_URL_NODE_01: '[]',
} as const

process.env = {
  ...process.env,
  ...environment,
}
