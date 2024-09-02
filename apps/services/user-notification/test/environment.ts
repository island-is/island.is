export const environment = {
  MAIN_QUEUE_NAME: 'test-main',
  DEAD_LETTER_QUEUE_NAME: 'test-failure',
  SQS_REGION: 'eu-west-1',
  SQS_ACCESS_KEY: 'testing',
  SQS_SECRET_ACCESS_KEY: 'testing',
  SERVICE_PORTAL_CLICK_ACTION_URL: 'https://island.is/minarsidur',
  // Disable redis registration during testing
  REDIS_URL_NODE_01: '[]',
} as const

process.env = {
  ...process.env,
  ...environment,
}
