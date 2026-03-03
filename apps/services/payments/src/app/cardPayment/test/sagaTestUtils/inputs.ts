import type { ApplePayChargeInput, ChargeCardInput } from '../../dtos'
import type { RefundCardPaymentInput } from '../../dtos'
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
      transactionId: 'tx-id',
    },
  },
  paymentMethod: { displayName: 'Visa 1234', network: 'Visa' },
  transactionIdentifier: 'tx-identifier',
})

export const getRefundInput = (): RefundCardPaymentInput => ({
  paymentFlowId: PAYMENT_FLOW_ID,
  reasonForRefund: 'fulfillment_failure',
})
