import type { RefundPaymentInput } from '../../dtos/refundPayment.input'
import { PAYMENT_FLOW_ID } from './mocks'

export const getRefundInput = (): RefundPaymentInput => ({
  paymentFlowId: PAYMENT_FLOW_ID,
  reasonForRefund: 'fulfillment_failure',
})
