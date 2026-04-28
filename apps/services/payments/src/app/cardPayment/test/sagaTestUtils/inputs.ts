import type { ApplePayChargeInput, ChargeCardInput } from '../../dtos'
import { PAYMENT_FLOW_ID } from './mocks'

export const getChargeCardInput = (): ChargeCardInput => ({
  paymentFlowId: PAYMENT_FLOW_ID,
  cardNumber: '4242424242424242',
  expiryMonth: 12,
  expiryYear: 25,
  cvc: '123',
})

export const getApplePayChargeInput = (): ApplePayChargeInput => ({
  paymentFlowId: PAYMENT_FLOW_ID,
  paymentData: {
    version: 'EC_v1',
    data: 'payment-data',
    signature: 'signature',
    header: {
      ephemeralPublicKey: 'key',
      publicKeyHash: 'hash',
      transactionId: 'abcdef0123456789',
    },
  },
  transactionIdentifier: 'abcdef0123456789',
})
