import { v4 as uuid } from 'uuid'
import { jest } from '@jest/globals'

import type { Logger } from '@island.is/logging'

export const PAYMENT_FLOW_ID = 'payment-flow-id'

export const createMockLogger = (): Logger =>
  ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
    child: jest.fn(),
  } as unknown as Logger)

export const mockPaymentFulfillmentWithFjs = {
  id: uuid(),
  paymentFlowId: PAYMENT_FLOW_ID,
  confirmationRefId: 'confirmation-id',
  paymentMethod: 'card' as const,
  fjsChargeId: 'fjs-charge-id',
  isDeleted: false,
  created: new Date(),
  modified: new Date(),
}

export const mockPaymentFulfillmentWithoutFjs = {
  ...mockPaymentFulfillmentWithFjs,
  fjsChargeId: null,
}

export const mockInvoicePaymentFulfillment = {
  id: uuid(),
  paymentFlowId: PAYMENT_FLOW_ID,
  confirmationRefId: 'fjs-charge-id',
  paymentMethod: 'invoice' as const,
  fjsChargeId: 'fjs-charge-id',
  isDeleted: false,
  created: new Date(),
  modified: new Date(),
}

export const mockCardPaymentConfirmation = {
  id: 'confirmation-id',
  paymentFlowId: PAYMENT_FLOW_ID,
  maskedCardNumber: '****1234',
  acquirerReferenceNumber: 'arn-123',
  authorizationCode: 'auth-123',
  cardScheme: 'Visa',
  totalPrice: 1000,
  cardUsage: 'credit',
  merchantReferenceData: 'merchant-ref',
  created: new Date(),
  modified: new Date(),
}
