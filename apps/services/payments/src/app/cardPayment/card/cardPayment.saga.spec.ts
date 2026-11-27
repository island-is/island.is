import type { Logger } from '@island.is/logging'

import {
  CardPaymentContext,
  CardPaymentStepResults,
  PaymentOrchestrator,
} from '../cardPayment.orchestrator'
import { CardPaymentService } from '../cardPayment.service'
import { PaymentFlowService } from '../../paymentFlow/paymentFlow.service'
import { RefundService } from '../../refund/refund.service'
import {
  createCardPaymentContext,
  createCardPaymentSaga,
} from './cardPayment.saga'
import {
  createMockLogger,
  createMockCardPaymentService,
  createMockPaymentFlowService,
  getChargeCardInput,
  mockPaymentResult,
} from '../test/sagaTestUtils'
import { GatewayApprovedUnreadableError } from '../approvedUnreadableCharge'

const resolved = <T>(v: T): never => v as never

const createMockRefundService = (): jest.Mocked<RefundService> =>
  ({
    refundWithCorrelationId: jest.fn().mockResolvedValue(
      resolved({
        isSuccess: true,
        acquirerReferenceNumber: 'refund-arn',
      }),
    ),
  } as unknown as jest.Mocked<RefundService>)

describe('Card Payment Saga - CHARGE_CARD step specific', () => {
  let mockLogger: Logger
  let mockCardPaymentService: jest.Mocked<CardPaymentService>
  let mockPaymentFlowService: jest.Mocked<PaymentFlowService>
  let mockRefundService: jest.Mocked<RefundService>

  beforeEach(() => {
    mockLogger = createMockLogger()
    mockCardPaymentService = createMockCardPaymentService()
    mockPaymentFlowService = createMockPaymentFlowService()
    mockRefundService = createMockRefundService()
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
        mockRefundService,
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
        mockRefundService,
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
        mockRefundService,
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

  describe('CHARGE_CARD approved but unreadable', () => {
    const run = async () => {
      const input = getChargeCardInput()
      const context = createCardPaymentContext(input.paymentFlowId, input)
      const saga = createCardPaymentSaga(
        mockCardPaymentService,
        mockRefundService,
        mockPaymentFlowService,
        mockLogger,
      )
      const orchestrator = new PaymentOrchestrator<
        CardPaymentContext,
        CardPaymentStepResults
      >(mockLogger, mockPaymentFlowService)

      await expect(orchestrator.execute(saga, context)).rejects.toThrow(
        'Failed to parse payment gateway response',
      )

      return context
    }

    beforeEach(() => {
      mockCardPaymentService.charge.mockRejectedValue(
        new GatewayApprovedUnreadableError(['isSuccess', 'responseCode']),
      )
    })

    it('refunds the charge by its correlation id', async () => {
      const context = await run()

      expect(mockRefundService.refundWithCorrelationId).toHaveBeenCalledTimes(1)
      expect(mockRefundService.refundWithCorrelationId).toHaveBeenCalledWith({
        paymentFlowId: context.paymentFlowId,
        paymentTrackingData: context.trackingData,
      })
      expect(context.metadata?.refundSucceeded).toBe(true)
      expect(mockPaymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: 'payment_failed',
          metadata: expect.objectContaining({
            correlationId: context.trackingData.correlationId,
          }),
        }),
      )
    })

    it('logs a refund that fails as CRITICAL', async () => {
      mockRefundService.refundWithCorrelationId.mockRejectedValue(
        new Error('Internal Server Error'),
      )

      const context = await run()

      expect(context.metadata?.refundSucceeded).toBe(false)
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('CRITICAL'),
        expect.objectContaining({
          correlationId: context.trackingData.correlationId,
        }),
      )
    })
  })
})
