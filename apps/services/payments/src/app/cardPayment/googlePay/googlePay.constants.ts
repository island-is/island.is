/**
 * Google's root signing keys for payment method tokens, per environment.
 * @see https://developers.google.com/pay/api/web/guides/resources/payment-data-cryptography#root-signing-keys
 */
export const GOOGLE_PAY_ROOT_KEYS_URLS = {
  TEST: 'https://payments.developers.google.com/paymentmethodtoken/test/keys.json',
  PRODUCTION:
    'https://payments.developers.google.com/paymentmethodtoken/keys.json',
} as const

export type GooglePayEnvironment = keyof typeof GOOGLE_PAY_ROOT_KEYS_URLS

// Google signs every ECv2 token as sender `Google`.
export const GOOGLE_PAY_SENDER_ID = 'Google'

// Recipient id Google signs TEST-environment tokens for, whatever our
// merchant id is. In production it is `merchant:` plus the console id.
export const GOOGLE_PAY_TEST_RECIPIENT_ID = 'merchant:12345678901234567890'
