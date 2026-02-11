import { v4 as uuid } from 'uuid'

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

/**
 * Creates a mock CardPaymentService with default resolutions for saga tests.
 * Override individual methods in tests as needed.
 */
export const createMockCardPaymentService = (
  overrides: Partial<Record<keyof CardPaymentService, jest.Mock>> = {},
): jest.Mocked<CardPaymentService> =>
  ({
    validatePaymentFlow: jest.fn().mockResolvedValue({
      paymentFlow: mockPaymentFlow,
      catalogItems: mockCatalogItems,
      totalPrice: 1000,
      paymentStatus: 'unpaid',
    }),
    charge: jest.fn().mockResolvedValue(mockPaymentResult),
    chargeApplePay: jest.fn().mockResolvedValue(mockPaymentResult),
    persistPaymentConfirmation: jest.fn().mockResolvedValue(undefined),
    refund: jest.fn().mockResolvedValue({
      isSuccess: true,
      acquirerReferenceNumber: 'refund-arn',
    }),
    refundWithCorrelationId: jest.fn().mockResolvedValue({
      isSuccess: true,
      acquirerReferenceNumber: 'refund-arn',
    }),
    ...overrides,
  } as unknown as jest.Mocked<CardPaymentService>)

/**
 * Creates a mock PaymentFlowService with default resolutions for saga tests.
 * Override individual methods in tests as needed.
 */
export const createMockPaymentFlowService = (
  overrides: Partial<Record<keyof PaymentFlowService, jest.Mock>> = {},
): jest.Mocked<PaymentFlowService> =>
  ({
    logPaymentFlowUpdate: jest.fn().mockResolvedValue(undefined),
    deleteCardPaymentConfirmation: jest.fn().mockResolvedValue({
      id: uuid(),
      paymentFlowId: PAYMENT_FLOW_ID,
    }),
    deletePaymentFulfillment: jest.fn().mockResolvedValue({}),
    findPaymentFulfillmentForPaymentFlow: jest
      .fn()
      .mockResolvedValue(mockPaymentFulfillmentWithoutFjs),
    getCardPaymentConfirmationForPaymentFlow: jest
      .fn()
      .mockResolvedValue(mockCardPaymentConfirmation),
    deleteFjsCharge: jest.fn().mockResolvedValue(undefined),
    deletePaymentFulfillment: jest.fn().mockResolvedValue({}),
    ...overrides,
  } as unknown as jest.Mocked<PaymentFlowService>)
