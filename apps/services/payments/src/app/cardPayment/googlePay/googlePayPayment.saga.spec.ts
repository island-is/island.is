import type { Logger } from '@island.is/logging'

import {
  GooglePayPaymentContext,
  GooglePayPaymentStepResults,
  PaymentOrchestrator,
} from '../cardPayment.orchestrator'
import { CardPaymentService } from '../cardPayment.service'
import { RefundService } from '../../refund/refund.service'
import { PaymentFlowService } from '../../paymentFlow/paymentFlow.service'
import {
  createGooglePayPaymentContext,
  createGooglePayPaymentSaga,
} from './googlePayPayment.saga'
import {
  createMockLogger,
  createMockCardPaymentService,
  createMockPaymentFlowService,
  getGooglePayChargeInput,
  PAYMENT_FLOW_ID,
} from '../test/sagaTestUtils'

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

/**
 * Google Pay saga tests.
 * Shared step tests (VALIDATE, PERSIST, NOTIFY) are in test/sagaSteps.shared.spec.ts
 * and run for the Card, Apple Pay and Google Pay sagas to ensure they stay in sync.
 */
describe('Google Pay Payment Saga - CHARGE_GOOGLE_PAY step specific', () => {
  let mockLogger: Logger
  let mockCardPaymentService: jest.Mocked<CardPaymentService>
  let mockRefundService: jest.Mocked<RefundService>
  let mockPaymentFlowService: jest.Mocked<PaymentFlowService>

  beforeEach(() => {
    mockLogger = createMockLogger()
    mockCardPaymentService = createMockCardPaymentService()
    mockRefundService = createMockRefundService()
    mockPaymentFlowService = createMockPaymentFlowService()
  })

  describe('createGooglePayPaymentContext', () => {
    it('should create context with paymentFlowId, input, and trackingData', () => {
      const input = getGooglePayChargeInput()
      const context = createGooglePayPaymentContext('flow-123', input)

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

  describe('CHARGE_GOOGLE_PAY', () => {
    it('should call chargeGooglePay with the token and trackingData', async () => {
      const input = getGooglePayChargeInput()
      const context = createGooglePayPaymentContext(PAYMENT_FLOW_ID, input)
      const saga = createGooglePayPaymentSaga(
        mockCardPaymentService,
        mockRefundService,
        mockPaymentFlowService,
        mockLogger,
      )
      const orchestrator = new PaymentOrchestrator<
        GooglePayPaymentContext,
        GooglePayPaymentStepResults
      >(mockLogger, mockPaymentFlowService)

      await orchestrator.execute(saga, context)

      expect(mockCardPaymentService.chargeGooglePay).toHaveBeenCalledWith({
        paymentFlowId: PAYMENT_FLOW_ID,
        token: input.token,
        paymentTrackingData: context.trackingData,
        amount: expect.any(Number),
      })
    })

    it('should not run any compensate when CHARGE_GOOGLE_PAY fails', async () => {
      mockCardPaymentService.chargeGooglePay.mockRejectedValue(
        new Error('Payment gateway error'),
      )

      const input = getGooglePayChargeInput()
      const context = createGooglePayPaymentContext(PAYMENT_FLOW_ID, input)
      const saga = createGooglePayPaymentSaga(
        mockCardPaymentService,
        mockRefundService,
        mockPaymentFlowService,
        mockLogger,
      )
      const orchestrator = new PaymentOrchestrator<
        GooglePayPaymentContext,
        GooglePayPaymentStepResults
      >(mockLogger, mockPaymentFlowService)

      await expect(orchestrator.execute(saga, context)).rejects.toThrow(
        'Payment gateway error',
      )

      expect(mockRefundService.refundWithCorrelationId).not.toHaveBeenCalled()
    })
  })

  describe('CHARGE_GOOGLE_PAY compensate (refund when PERSIST fails)', () => {
    it('should call refundWithCorrelationId with trackingData when PERSIST fails', async () => {
      mockCardPaymentService.persistPaymentConfirmation.mockRejectedValue(
        new Error('Database error'),
      )

      const input = getGooglePayChargeInput()
      const context = createGooglePayPaymentContext(PAYMENT_FLOW_ID, input)
      const saga = createGooglePayPaymentSaga(
        mockCardPaymentService,
        mockRefundService,
        mockPaymentFlowService,
        mockLogger,
      )
      const orchestrator = new PaymentOrchestrator<
        GooglePayPaymentContext,
        GooglePayPaymentStepResults
      >(mockLogger, mockPaymentFlowService)

      await expect(orchestrator.execute(saga, context)).rejects.toThrow(
        'Database error',
      )

      expect(mockRefundService.refundWithCorrelationId).toHaveBeenCalledWith({
        paymentTrackingData: context.trackingData,
        paymentFlowId: PAYMENT_FLOW_ID,
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
