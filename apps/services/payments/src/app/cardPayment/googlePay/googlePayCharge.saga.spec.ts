import type { Logger } from '@island.is/logging'

import {
  GooglePayChargeContext,
  GooglePayChargeStepResults,
  PaymentOrchestrator,
} from '../cardPayment.orchestrator'
import { CardPaymentService } from '../cardPayment.service'
import { RefundService } from '../../refund/refund.service'
import { PaymentFlowService } from '../../paymentFlow/paymentFlow.service'
import { GooglePayUnsettledChargeError } from './googlePay.utils'
import {
  chargedGooglePayPaymentResult,
  createGooglePayChargeContext,
  createGooglePayChargeSaga,
} from './googlePayCharge.saga'
import {
  createMockLogger,
  createMockCardPaymentService,
  createMockPaymentFlowService,
  getGooglePayChargeInput,
  mockCardVerification,
  mockGooglePayCard,
  mockPaymentResult,
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
 * Google Pay charge saga tests: the branch on what the gateway did with the
 * token. The settlement steps after a charge are tested with the other card
 * sagas in test/sagaSteps.shared.spec.ts.
 */
describe('Google Pay Charge Saga - DECRYPT_GOOGLE_PAY_TOKEN branch', () => {
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

  const setupSaga = () => {
    const input = getGooglePayChargeInput()
    const context = createGooglePayChargeContext(PAYMENT_FLOW_ID, input)
    const saga = createGooglePayChargeSaga(
      mockCardPaymentService,
      mockRefundService,
      mockPaymentFlowService,
      mockLogger,
    )
    const orchestrator = new PaymentOrchestrator<
      GooglePayChargeContext,
      GooglePayChargeStepResults
    >(mockLogger, mockPaymentFlowService)

    return {
      input,
      context,
      run: () => orchestrator.execute(saga, context, 'VALIDATE'),
    }
  }

  const decryptsTheCard = () =>
    mockCardPaymentService.decryptOrChargeGooglePayToken.mockResolvedValue(
      resolved({ outcome: 'card', card: mockGooglePayCard }),
    )

  describe('createGooglePayChargeContext', () => {
    it('should create context with paymentFlowId, input, and trackingData', () => {
      const input = getGooglePayChargeInput()
      const context = createGooglePayChargeContext('flow-123', input)

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

  it('sends the token to the gateway with the tracking data, after announcing the payment', async () => {
    const { input, context, run } = setupSaga()

    await run()

    expect(
      mockCardPaymentService.decryptOrChargeGooglePayToken,
    ).toHaveBeenCalledWith({
      paymentFlowId: PAYMENT_FLOW_ID,
      token: input.token,
      paymentTrackingData: context.trackingData,
      amount: 1000,
    })
    expect(mockPaymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: 'payment_started',
        metadata: { correlationId: context.trackingData.correlationId },
      }),
    )
  })

  describe('when the gateway decrypts the token (a card saved in the Google account)', () => {
    beforeEach(() => decryptsTheCard())

    it('starts 3-D Secure for the card and ends there, charging nothing', async () => {
      const { input, context, run } = setupSaga()

      const result = await run()

      expect(result.success).toBe(true)
      expect(context.completedSteps).toEqual([
        'VALIDATE',
        'DECRYPT_GOOGLE_PAY_TOKEN',
        'START_VERIFICATION',
      ])
      expect(
        mockCardPaymentService.verifyGooglePaySavedCard,
      ).toHaveBeenCalledWith({
        input,
        card: mockGooglePayCard,
        totalPrice: 1000,
      })
      expect(context.stepResults.START_VERIFICATION).toEqual({
        verification: mockCardVerification,
      })
      expect(
        mockCardPaymentService.persistPaymentConfirmation,
      ).not.toHaveBeenCalled()
      expect(
        mockPaymentFlowService.logPaymentFlowUpdate.mock.calls.filter(
          ([update]) => update.reason === 'payment_completed',
        ),
      ).toHaveLength(0)
      expect(() => chargedGooglePayPaymentResult(context)).toThrow(
        'decrypted, not charged',
      )
    })

    it('refunds nothing when 3-D Secure can not be started', async () => {
      mockCardPaymentService.verifyGooglePaySavedCard.mockRejectedValue(
        new Error('Verification gateway error'),
      )
      const { context, run } = setupSaga()

      await expect(run()).rejects.toThrow('Verification gateway error')

      expect(mockRefundService.refundWithCorrelationId).not.toHaveBeenCalled()
      expect(context.metadata?.refundSucceeded).toBeUndefined()
    })
  })

  describe('when the gateway charges the token (a device token)', () => {
    it('settles the payment without 3-D Secure', async () => {
      const { context, run } = setupSaga()

      const result = await run()

      expect(result.success).toBe(true)
      expect(context.completedSteps).toEqual([
        'VALIDATE',
        'DECRYPT_GOOGLE_PAY_TOKEN',
        'PERSIST_PAYMENT_CONFIRMATION',
        'SETTLE_DEBT',
        'NOTIFY_SUCCESSFUL_PAYMENT',
      ])
      expect(
        mockCardPaymentService.verifyGooglePaySavedCard,
      ).not.toHaveBeenCalled()
      expect(chargedGooglePayPaymentResult(context)).toEqual(mockPaymentResult)
      expect(
        mockCardPaymentService.persistPaymentConfirmation,
      ).toHaveBeenCalledWith({
        paymentFlowId: PAYMENT_FLOW_ID,
        paymentResult: mockPaymentResult,
        paymentTrackingData: context.trackingData,
        totalPrice: 1000,
      })
    })

    it('refunds the payment by the tracking data when PERSIST fails', async () => {
      mockCardPaymentService.persistPaymentConfirmation.mockRejectedValue(
        new Error('Database error'),
      )
      const { context, run } = setupSaga()

      await expect(run()).rejects.toThrow('Database error')

      expect(mockRefundService.refundWithCorrelationId).toHaveBeenCalledWith({
        paymentTrackingData: context.trackingData,
        paymentFlowId: PAYMENT_FLOW_ID,
      })
      expect(mockPaymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: 'payment_failed',
          message:
            'Card payment refunded: failed to complete payment processing.',
          metadata: expect.objectContaining({
            payment: mockPaymentResult,
            correlationId: context.trackingData.correlationId,
          }),
        }),
      )
      expect(context.metadata?.refundSucceeded).toBe(true)
    })

    it('records a failed refund for the controller', async () => {
      mockCardPaymentService.persistPaymentConfirmation.mockRejectedValue(
        new Error('Database error'),
      )
      mockRefundService.refundWithCorrelationId.mockRejectedValue(
        new Error('Refund gateway error'),
      )
      const { context, run } = setupSaga()

      await expect(run()).rejects.toThrow('Database error')

      expect(context.metadata).toMatchObject({
        refundSucceeded: false,
        refundError: 'Refund gateway error',
      })
    })
  })

  describe('when the gateway call fails with the outcome unknown', () => {
    const unsettled = (context: GooglePayChargeContext) =>
      new GooglePayUnsettledChargeError(
        'Internal Server Error',
        context.trackingData,
      )

    it('refunds by the tracking data it sent, then fails the saga', async () => {
      const { context, run } = setupSaga()
      mockCardPaymentService.decryptOrChargeGooglePayToken.mockRejectedValue(
        unsettled(context),
      )

      await expect(run()).rejects.toThrow('Internal Server Error')

      expect(mockRefundService.refundWithCorrelationId).toHaveBeenCalledWith({
        paymentTrackingData: context.trackingData,
        paymentFlowId: PAYMENT_FLOW_ID,
      })
      expect(mockPaymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: 'payment_failed',
          metadata: expect.objectContaining({
            correlationId: context.trackingData.correlationId,
            originalError: 'Internal Server Error',
          }),
        }),
      )
      expect(context.metadata?.refundSucceeded).toBe(true)
      expect(
        mockCardPaymentService.verifyGooglePaySavedCard,
      ).not.toHaveBeenCalled()
    })

    it('leaves the payer with the original error when there was nothing to refund', async () => {
      mockRefundService.refundWithCorrelationId.mockRejectedValue(
        new Error('No transaction found'),
      )
      const { context, run } = setupSaga()
      mockCardPaymentService.decryptOrChargeGooglePayToken.mockRejectedValue(
        unsettled(context),
      )

      await expect(run()).rejects.toThrow('Internal Server Error')

      // Not a failed refund of a known payment: the outcome stays unknown
      expect(context.metadata?.refundSucceeded).toBeUndefined()
      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('unknown outcome'),
        expect.objectContaining({
          googlePayOutcomeUnknown: true,
          correlationId: context.trackingData.correlationId,
        }),
      )
    })
  })

  it('compensates nothing when the gateway declines the token', async () => {
    mockCardPaymentService.decryptOrChargeGooglePayToken.mockRejectedValue(
      new Error('Payment gateway error'),
    )
    const { run } = setupSaga()

    await expect(run()).rejects.toThrow('Payment gateway error')

    expect(mockRefundService.refundWithCorrelationId).not.toHaveBeenCalled()
    expect(
      mockCardPaymentService.verifyGooglePaySavedCard,
    ).not.toHaveBeenCalled()
  })
})
