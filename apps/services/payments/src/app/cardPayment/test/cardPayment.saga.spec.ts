import { v4 as uuid } from 'uuid'

import type { Logger } from '@island.is/logging'

import {
  CardPaymentContext,
  CardPaymentStepResults,
  PaymentOrchestrator,
} from '../cardPayment.orchestrator'
import { CardPaymentService } from '../cardPayment.service'
import { PaymentFlowService } from '../../paymentFlow/paymentFlow.service'
import {
  createCardPaymentContext,
  createCardPaymentSaga,
} from '../cardPayment.saga'
import { ChargeCardInput } from '../dtos'

const createMockLogger = (): Logger =>
  ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
    child: jest.fn(),
  } as unknown as Logger)

const mockPaymentFlow = {
  id: 'payment-flow-id',
  organisationId: 'org-id',
  payerNationalId: '1234567890',
  charges: [],
  availablePaymentMethods: ['card'],
  onUpdateUrl: 'https://example.com/callback',
}

const mockCatalogItems = [
  {
    chargeItemCode: '123',
    chargeItemName: 'Test charge',
    priceAmount: 1000,
    quantity: 1,
  },
]

const mockPaymentResult = {
  isSuccess: true,
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

const getChargeCardInput = (): ChargeCardInput => ({
  paymentFlowId: 'payment-flow-id',
  cardNumber: '4242424242424242',
  expiryMonth: 12,
  expiryYear: 25,
  cvc: '123',
})

describe('Card Payment Saga - CHARGE_CARD step specific', () => {
  let mockLogger: Logger
  let mockCardPaymentService: jest.Mocked<CardPaymentService>
  let mockPaymentFlowService: jest.Mocked<PaymentFlowService>

  beforeEach(() => {
    mockLogger = createMockLogger()
    mockCardPaymentService = {
      validatePaymentFlow: jest.fn().mockResolvedValue({
        paymentFlow: mockPaymentFlow,
        catalogItems: mockCatalogItems,
        totalPrice: 1000,
        paymentStatus: 'unpaid',
      }),
      charge: jest.fn().mockResolvedValue(mockPaymentResult),
      persistPaymentConfirmation: jest.fn().mockResolvedValue(undefined),
      refund: jest.fn().mockResolvedValue({
        isSuccess: true,
        acquirerReferenceNumber: 'refund-arn',
      }),
    } as unknown as jest.Mocked<CardPaymentService>

    mockPaymentFlowService = {
      logPaymentFlowUpdate: jest.fn().mockResolvedValue(undefined),
      deleteCardPaymentConfirmation: jest.fn().mockResolvedValue({
        id: uuid(),
        paymentFlowId: 'payment-flow-id',
      }),
      deletePaymentFulfillment: jest.fn().mockResolvedValue({}),
    } as unknown as jest.Mocked<PaymentFlowService>
  })

  describe('createCardPaymentContext', () => {
    it('should create context with paymentFlowId, input, and trackingData', () => {
      const input = getChargeCardInput()
      const context = createCardPaymentContext('flow-123', input)

      expect(context.paymentFlowId).toBe('flow-123')
      expect(context.input).toEqual(input)
      expect(context.paymentMethod).toBe('card')
      expect(context.trackingData).toMatchObject({
        merchantReferenceData: expect.any(String),
        correlationId: expect.any(String),
        paymentDate: expect.any(Date),
      })
      expect(context.stepResults).toEqual({})
      expect(context.completedSteps).toEqual([])
    })
  })

  describe('CHARGE_CARD', () => {
    it('should call charge with input and trackingData', async () => {
      const input = getChargeCardInput()
      const context = createCardPaymentContext(input.paymentFlowId, input)
      const saga = createCardPaymentSaga(
        mockCardPaymentService,
        mockPaymentFlowService,
        mockLogger,
      )
      const orchestrator = new PaymentOrchestrator<
        CardPaymentContext,
        CardPaymentStepResults
      >(mockLogger, mockPaymentFlowService)

      await orchestrator.execute(saga, context)

      expect(mockCardPaymentService.charge).toHaveBeenCalledWith({
        chargeCardInput: input,
        paymentTrackingData: context.trackingData,
        amount: 1000,
      })
    })

    it('should not run any compensate when CHARGE_CARD fails', async () => {
      mockCardPaymentService.charge.mockRejectedValue(
        new Error('Payment gateway error'),
      )

      const input = getChargeCardInput()
      const context = createCardPaymentContext(input.paymentFlowId, input)
      const saga = createCardPaymentSaga(
        mockCardPaymentService,
        mockPaymentFlowService,
        mockLogger,
      )
      const orchestrator = new PaymentOrchestrator<
        CardPaymentContext,
        CardPaymentStepResults
      >(mockLogger, mockPaymentFlowService)

      await expect(orchestrator.execute(saga, context)).rejects.toThrow(
        'Payment gateway error',
      )

      expect(mockCardPaymentService.refund).not.toHaveBeenCalled()
    })
  })

  describe('CHARGE_CARD compensate (refund when PERSIST fails)', () => {
    it('should call refund with cardNumber and acquirerReferenceNumber when PERSIST fails', async () => {
      mockCardPaymentService.persistPaymentConfirmation.mockRejectedValue(
        new Error('Database error'),
      )

      const input = getChargeCardInput()
      const context = createCardPaymentContext(input.paymentFlowId, input)
      const saga = createCardPaymentSaga(
        mockCardPaymentService,
        mockPaymentFlowService,
        mockLogger,
      )
      const orchestrator = new PaymentOrchestrator<
        CardPaymentContext,
        CardPaymentStepResults
      >(mockLogger, mockPaymentFlowService)

      await expect(orchestrator.execute(saga, context)).rejects.toThrow(
        'Database error',
      )

      expect(mockCardPaymentService.refund).toHaveBeenCalledWith({
        paymentFlowId: input.paymentFlowId,
        cardNumber: input.cardNumber,
        acquirerReferenceNumber: mockPaymentResult.acquirerReferenceNumber,
        amount: 1000,
      })
      expect(mockPaymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: 'payment_failed',
          message:
            'Card payment refunded: failed to complete payment processing.',
        }),
      )
      expect(context.metadata?.refundSucceeded).toBe(true)
    })
  })
})
