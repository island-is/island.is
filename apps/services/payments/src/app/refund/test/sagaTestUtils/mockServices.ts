import { v4 as uuid } from 'uuid'
import { jest } from '@jest/globals'

import type { RefundService } from '../../refund.service'
import type { PaymentFlowService } from '../../../paymentFlow/paymentFlow.service'
import {
  mockCardPaymentConfirmation,
  mockPaymentFulfillmentWithoutFjs,
  mockInvoicePaymentFulfillment,
  PAYMENT_FLOW_ID,
} from './mocks'

/** Cast for mockResolvedValue to satisfy strict jest.Mock from @jest/globals */
const resolved = <T>(v: T): never => v as never

export const createMockRefundService = (
  overrides: Partial<Record<keyof RefundService, jest.Mock>> = {},
): jest.Mocked<RefundService> => {
  const mock: Record<string, jest.Mock> = {
    refundWithCorrelationId: jest.fn().mockResolvedValue(
      resolved({
        isSuccess: true,
        acquirerReferenceNumber: 'refund-arn',
      }),
    ),
    ...overrides,
  }
  return mock as unknown as jest.Mocked<RefundService>
}

export const createMockPaymentFlowService = (
  overrides: Partial<Record<keyof PaymentFlowService, jest.Mock>> = {},
): jest.Mocked<PaymentFlowService> => {
  const mock: Record<string, jest.Mock> = {
    logPaymentFlowUpdate: jest.fn().mockResolvedValue(resolved(undefined)),
    validateCharge: jest.fn().mockResolvedValue(resolved(undefined)),
    deleteCardPaymentConfirmation: jest.fn().mockResolvedValue(
      resolved({
        id: uuid(),
        paymentFlowId: PAYMENT_FLOW_ID,
      }),
    ),
    deletePaymentFulfillment: jest
      .fn()
      .mockResolvedValue(resolved(mockInvoicePaymentFulfillment)),
    restoreCardPaymentConfirmation: jest.fn().mockResolvedValue(resolved({})),
    restorePaymentFulfillment: jest.fn().mockResolvedValue(resolved({})),
    findPaymentFulfillmentForPaymentFlow: jest
      .fn()
      .mockResolvedValue(resolved(mockPaymentFulfillmentWithoutFjs)),
    getCardPaymentConfirmationForPaymentFlow: jest
      .fn()
      .mockResolvedValue(resolved(mockCardPaymentConfirmation)),
    deleteFjsCharge: jest.fn().mockResolvedValue(resolved(undefined)),
    ...overrides,
  }
  return mock as unknown as jest.Mocked<PaymentFlowService>
}
