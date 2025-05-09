export const environment = {
  PAYMENTS_GATEWAY_API_SECRET: 'paymentgatewaysupersecret',
  PAYMENTS_GATEWAY_API_HEADER_KEY: 'key',
  PAYMENTS_GATEWAY_API_HEADER_VALUE: 'value',
  PAYMENTS_GATEWAY_SYSTEM_CALLING: 'test',
} as const

process.env = {
  ...process.env,
  ...environment,
}
