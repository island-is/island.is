import type { ApplePayChargeInput } from '../../applePay/dtos'
import type { ChargeCardInput } from '../../card/dtos'
import type { GooglePayChargeInput } from '../../googlePay/dtos'
import type { GooglePayDecryptedToken } from '../../googlePay/googlePayToken'
import { PAYMENT_FLOW_ID } from './mocks'

export const getChargeCardInput = (): ChargeCardInput => ({
  paymentFlowId: PAYMENT_FLOW_ID,
  cardNumber: '4242424242424242',
  expiryMonth: 12,
  expiryYear: 25,
  cvc: '123',
})

// 64-char hex (32 bytes) — matches Apple's canonical transactionId format
// enforced by the input DTO regex.
const TEST_APPLE_PAY_TRANSACTION_ID =
  'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789'

export const getApplePayChargeInput = (): ApplePayChargeInput => ({
  paymentFlowId: PAYMENT_FLOW_ID,
  paymentData: {
    version: 'EC_v1',
    data: 'payment-data',
    signature: 'signature',
    header: {
      ephemeralPublicKey: 'key',
      publicKeyHash: 'hash',
      transactionId: TEST_APPLE_PAY_TRANSACTION_ID,
    },
  },
  transactionIdentifier: TEST_APPLE_PAY_TRANSACTION_ID,
})

export const getGooglePayChargeInput = (): GooglePayChargeInput => ({
  paymentFlowId: PAYMENT_FLOW_ID,
  token: '{"protocolVersion":"ECv2"}',
})

export const getGooglePayDecryptedToken = (): GooglePayDecryptedToken => ({
  messageId: 'AH2EjtfmrQ',
  messageExpiration: Date.now() + 60 * 60 * 1000,
  paymentMethodDetails: {
    pan: '4111111111111111',
    expirationMonth: 12,
    expirationYear: 2030,
    authMethod: 'CRYPTOGRAM_3DS',
    cryptogram: 'AAAAAA0ZfXkAAAAAAAAAAAAAAAA=',
  },
})
