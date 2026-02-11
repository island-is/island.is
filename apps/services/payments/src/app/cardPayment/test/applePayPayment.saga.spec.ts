import type { Logger } from '@island.is/logging'

import {
  ApplePayPaymentContext,
  ApplePayPaymentStepResults,
  PaymentOrchestrator,
} from '../cardPayment.orchestrator'
import { CardPaymentService } from '../cardPayment.service'
import { PaymentFlowService } from '../../paymentFlow/paymentFlow.service'
import {
  createApplePayPaymentContext,
  createApplePayPaymentSaga,
} from '../applePayPayment.saga'
import {
  createMockLogger,
  createMockCardPaymentService,
  createMockPaymentFlowService,
  getApplePayChargeInput,
} from './sagaTestUtils'

/**
 * Apple Pay saga tests.
 * Shared step tests (VALIDATE, PERSIST, NOTIFY) are in cardPaymentSagaSteps.shared.spec.ts
 * and run for both Card and Apple Pay sagas to ensure they stay in sync.
 */
describe('Apple Pay Payment Saga - CHARGE_APPLE_PAY step specific', () => {
  let mockLogger: Logger
  let mockCardPaymentService: jest.Mocked<CardPaymentService>
  let mockPaymentFlowService: jest.Mocked<PaymentFlowService>

  beforeEach(() => {
    mockLogger = createMockLogger()
    mockCardPaymentService = createMockCardPaymentService()
    mockPaymentFlowService = createMockPaymentFlowService()
  })

  describe('createApplePayPaymentContext', () => {
    it('should create context with paymentFlowId, input, and trackingData', () => {
      const input = getApplePayChargeInput()
      const context = createApplePayPaymentContext('flow-123', input)

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

  describe('CHARGE_APPLE_PAY', () => {
    it('should call chargeApplePay with input and trackingData', async () => {
      const input = getApplePayChargeInput()
      const context = createApplePayPaymentContext(input.paymentFlowId, input)
      const saga = createApplePayPaymentSaga(
        mockCardPaymentService,
        mockPaymentFlowService,
        mockLogger,
      )
      const orchestrator = new PaymentOrchestrator<
        ApplePayPaymentContext,
        ApplePayPaymentStepResults
      >(mockLogger, mockPaymentFlowService)

      await orchestrator.execute(saga, context)

      expect(mockCardPaymentService.chargeApplePay).toHaveBeenCalledWith(
        input,
        context.trackingData,
      )
    })

    it('should not run any compensate when CHARGE_APPLE_PAY fails', async () => {
      mockCardPaymentService.chargeApplePay.mockRejectedValue(
        new Error('Payment gateway error'),
      )

      const input = getApplePayChargeInput()
      const context = createApplePayPaymentContext(input.paymentFlowId, input)
      const saga = createApplePayPaymentSaga(
        mockCardPaymentService,
        mockPaymentFlowService,
        mockLogger,
      )
      const orchestrator = new PaymentOrchestrator<
        ApplePayPaymentContext,
        ApplePayPaymentStepResults
      >(mockLogger, mockPaymentFlowService)

      await expect(orchestrator.execute(saga, context)).rejects.toThrow(
        'Payment gateway error',
      )

      expect(
        mockCardPaymentService.refundWithCorrelationId,
      ).not.toHaveBeenCalled()
    })
  })

  describe('CHARGE_APPLE_PAY compensate (refund when PERSIST fails)', () => {
    it('should call refundWithCorrelationId with trackingData when PERSIST fails', async () => {
      mockCardPaymentService.persistPaymentConfirmation.mockRejectedValue(
        new Error('Database error'),
      )

      const input = getApplePayChargeInput()
      const context = createApplePayPaymentContext(input.paymentFlowId, input)
      const saga = createApplePayPaymentSaga(
        mockCardPaymentService,
        mockPaymentFlowService,
        mockLogger,
      )
      const orchestrator = new PaymentOrchestrator<
        ApplePayPaymentContext,
        ApplePayPaymentStepResults
      >(mockLogger, mockPaymentFlowService)

      await expect(orchestrator.execute(saga, context)).rejects.toThrow(
        'Database error',
      )

      expect(
        mockCardPaymentService.refundWithCorrelationId,
      ).toHaveBeenCalledWith({
        paymentTrackingData: context.trackingData,
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
