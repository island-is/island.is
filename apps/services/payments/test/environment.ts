import { generateKeyPairSync } from 'crypto'

const generateTestKeyPair = () => {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  })

  return {
    privateKey: Buffer.from(privateKey).toString('base64'),
    publicKey: Buffer.from(publicKey).toString('base64'),
  }
}

const testKeys = generateTestKeyPair()

export const environment = {
  PAYMENTS_GATEWAY_API_SECRET: 'paymentgatewaysupersecret',
  PAYMENTS_GATEWAY_API_HEADER_KEY: 'key',
  PAYMENTS_GATEWAY_API_HEADER_VALUE: 'value',
  PAYMENTS_GATEWAY_SYSTEM_CALLING: 'test',
  PAYMENTS_WEB_URL: 'https://payments.test',
  PAYMENTS_JWT_SIGNING_KEY_ID: 'payments_test_key_0',
  PAYMENTS_JWT_SIGNING_PRIVATE_KEY: testKeys.privateKey,
  PAYMENTS_JWT_SIGNING_PUBLIC_KEY: testKeys.publicKey,
  PAYMENTS_JWT_SIGNING_EXPIRES_IN_MINUTES: '5',
} as const

process.env = {
  ...process.env,
  ...environment,
}
