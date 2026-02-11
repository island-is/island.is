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

export const mockPaymentFlow = {
  id: PAYMENT_FLOW_ID,
  organisationId: 'org-id',
  payerNationalId: '1234567890',
  charges: [],
  availablePaymentMethods: ['card'] as const,
  onUpdateUrl: 'https://example.com/callback',
}

export const mockCatalogItems = [
  {
    chargeItemCode: '123',
    chargeItemName: 'Test charge',
    priceAmount: 1000,
    quantity: 1,
  },
]

export const mockPaymentResult = {
  isSuccess: true as const,
  acquirerReferenceNumber: 'arn-123',
  authorizationCode: 'auth-123',
  maskedCardNumber: '****1234',
  cardInformation: { cardScheme: 'Visa', cardUsage: 'credit' },
  transactionID: 'tx-123',
  transactionLifecycleId: 'tlc-123',
  authorizationIdentifier: 'auth-id',
  responseCode: '00',
  responseDescription: 'Success',
  responseTime: '12:00:00',
  correlationID: 'corr-123',
}

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
