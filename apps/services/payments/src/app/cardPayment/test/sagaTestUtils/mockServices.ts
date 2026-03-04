import { v4 as uuid } from 'uuid'
import { jest } from '@jest/globals'

import type { CardPaymentService } from '../../cardPayment.service'
import type { PaymentFlowService } from '../../../paymentFlow/paymentFlow.service'
import {
  mockCardPaymentConfirmation,
  mockPaymentFulfillmentWithoutFjs,
  mockPaymentFlow,
  mockCatalogItems,
  mockPaymentResult,
  PAYMENT_FLOW_ID,
} from './mocks'

/** Cast for mockResolvedValue to satisfy strict jest.Mock from @jest/globals */
const resolved = <T>(v: T): never => v as never

/**
 * Creates a mock CardPaymentService with default resolutions for saga tests.
 * Override individual methods in tests as needed.
 */
export const createMockCardPaymentService = (
  overrides: Partial<Record<keyof CardPaymentService, jest.Mock>> = {},
): jest.Mocked<CardPaymentService> => {
  const mock: Record<string, jest.Mock> = {
    validatePaymentFlow: jest.fn().mockResolvedValue(
      resolved({
        paymentFlow: mockPaymentFlow,
        catalogItems: mockCatalogItems,
        totalPrice: 1000,
        paymentStatus: 'unpaid',
      }),
    ),
    charge: jest.fn().mockResolvedValue(resolved(mockPaymentResult)),
    chargeApplePay: jest.fn().mockResolvedValue(resolved(mockPaymentResult)),
    persistPaymentConfirmation: jest
      .fn()
      .mockResolvedValue(resolved(undefined)),
    refund: jest.fn().mockResolvedValue(
      resolved({
        isSuccess: true,
        acquirerReferenceNumber: 'refund-arn',
      }),
    ),
    refundWithCorrelationId: jest.fn().mockResolvedValue(
      resolved({
        isSuccess: true,
        acquirerReferenceNumber: 'refund-arn',
      }),
    ),
    ...overrides,
  }
  return mock as unknown as jest.Mocked<CardPaymentService>
}

/**
 * Creates a mock PaymentFlowService with default resolutions for saga tests.
 * Override individual methods in tests as needed.
 */
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
    deletePaymentFulfillment: jest.fn().mockResolvedValue(resolved({})),
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
