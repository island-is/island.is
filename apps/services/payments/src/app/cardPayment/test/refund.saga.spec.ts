import type { Logger } from '@island.is/logging'
import { PaymentServiceCode } from '@island.is/shared/constants'

import { PaymentFlowService } from '../../paymentFlow/paymentFlow.service'
import {
  PaymentOrchestrator,
  RefundContext,
  RefundStepResults,
} from '../cardPayment.orchestrator'
import { CardPaymentService } from '../cardPayment.service'
import {
  createRefundContext,
  createRefundSaga,
  REFUND_SAGA_START_STEP,
} from '../refund.saga'
import {
  createMockLogger,
  createMockPaymentFlowService,
  getRefundInput,
  mockCardPaymentConfirmation,
  mockPaymentFulfillmentWithFjs,
  mockPaymentFulfillmentWithoutFjs,
} from './sagaTestUtils'

describe('Refund Saga', () => {
  let mockLogger: Logger
  let mockCardPaymentService: jest.Mocked<CardPaymentService>
  let mockPaymentFlowService: jest.Mocked<PaymentFlowService>

  const setupSaga = (input = getRefundInput()) => {
    const context = createRefundContext(input.paymentFlowId, input)
    const saga = createRefundSaga(
      mockCardPaymentService,
      mockPaymentFlowService,
      mockLogger,
    )
    const orchestrator = new PaymentOrchestrator<
      RefundContext,
      RefundStepResults
    >(mockLogger, mockPaymentFlowService)
    return { input, context, saga, orchestrator }
  }

  beforeEach(() => {
    mockLogger = createMockLogger()
    mockCardPaymentService = {
      refundWithCorrelationId: jest.fn().mockResolvedValue({
        isSuccess: true,
        acquirerReferenceNumber: 'refund-arn',
      }),
    } as unknown as jest.Mocked<CardPaymentService>

    mockPaymentFlowService = createMockPaymentFlowService()
  })

  describe('createRefundContext', () => {
    it('should create context with paymentFlowId and input', () => {
      const input = getRefundInput()
      const context = createRefundContext('flow-123', input)

      expect(context.paymentFlowId).toBe('flow-123')
      expect(context.input).toEqual(input)
      expect(context.paymentMethod).toBe('card')
      expect(context.stepResults).toEqual({})
      expect(context.completedSteps).toEqual([])
    })
  })

  describe('VALIDATE_REFUND', () => {
    it('should call findPaymentFulfillmentForPaymentFlow and getCardPaymentConfirmationForPaymentFlow', async () => {
      const { input, context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(saga, context, REFUND_SAGA_START_STEP)

      expect(
        mockPaymentFlowService.findPaymentFulfillmentForPaymentFlow,
      ).toHaveBeenCalledWith(input.paymentFlowId)
      expect(
        mockPaymentFlowService.getCardPaymentConfirmationForPaymentFlow,
      ).toHaveBeenCalledWith(input.paymentFlowId)
    })

    it('should throw when payment fulfillment is missing', async () => {
      mockPaymentFlowService.findPaymentFulfillmentForPaymentFlow.mockResolvedValue(
        null,
      )

      const { context, saga, orchestrator } = setupSaga()

      await expect(
        orchestrator.execute(saga, context, REFUND_SAGA_START_STEP),
      ).rejects.toThrow(PaymentServiceCode.PaymentFlowNotEligibleToBeRefunded)
    })

    it('should throw when payment method is not card', async () => {
      mockPaymentFlowService.findPaymentFulfillmentForPaymentFlow.mockResolvedValue(
        {
          ...mockPaymentFulfillmentWithoutFjs,
          paymentMethod: 'invoice' as const,
        },
      )

      const { context, saga, orchestrator } = setupSaga()

      await expect(
        orchestrator.execute(saga, context, REFUND_SAGA_START_STEP),
      ).rejects.toThrow(PaymentServiceCode.PaymentFlowNotEligibleToBeRefunded)
    })

    it('should throw when card payment confirmation is missing', async () => {
      mockPaymentFlowService.getCardPaymentConfirmationForPaymentFlow.mockResolvedValue(
        null,
      )

      const { context, saga, orchestrator } = setupSaga()

      await expect(
        orchestrator.execute(saga, context, REFUND_SAGA_START_STEP),
      ).rejects.toThrow(PaymentServiceCode.PaymentFlowNotEligibleToBeRefunded)
    })
  })

  describe('REFUND_PAYMENT path (no FJS charge)', () => {
    it('should call refundWithCorrelationId and log refund started', async () => {
      const { input, context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(saga, context, REFUND_SAGA_START_STEP)

      expect(mockPaymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentFlowId: input.paymentFlowId,
          reason: 'refund_started',
          message: 'Refund started because of fulfillment failure',
        }),
      )
      expect(
        mockCardPaymentService.refundWithCorrelationId,
      ).toHaveBeenCalledWith({
        paymentTrackingData: {
          merchantReferenceData:
            mockCardPaymentConfirmation.merchantReferenceData,
          correlationId: mockCardPaymentConfirmation.id,
          paymentDate: expect.any(Date),
        },
      })
    })

    it('should not call deleteFjsCharge when hasFjsCharge is false', async () => {
      const { context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(saga, context, REFUND_SAGA_START_STEP)

      expect(mockPaymentFlowService.deleteFjsCharge).not.toHaveBeenCalled()
    })
  })

  describe('DELETE_FJS_CHARGE path (has FJS charge)', () => {
    beforeEach(() => {
      mockPaymentFlowService.findPaymentFulfillmentForPaymentFlow.mockResolvedValue(
        mockPaymentFulfillmentWithFjs,
      )
    })

    it('should call deleteFjsCharge and not refundWithCorrelationId', async () => {
      const { input, context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(saga, context, REFUND_SAGA_START_STEP)

      expect(mockPaymentFlowService.deleteFjsCharge).toHaveBeenCalledWith(
        input.paymentFlowId,
      )
      expect(
        mockCardPaymentService.refundWithCorrelationId,
      ).not.toHaveBeenCalled()
    })
  })

  describe('DELETE_CARD_PAYMENT_CONFIRMATION', () => {
    it('should call deleteCardPaymentConfirmation and deletePaymentFulfillment', async () => {
      const { input, context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(saga, context, REFUND_SAGA_START_STEP)

      expect(
        mockPaymentFlowService.deleteCardPaymentConfirmation,
      ).toHaveBeenCalledWith(
        input.paymentFlowId,
        mockCardPaymentConfirmation.id,
      )
      expect(
        mockPaymentFlowService.deletePaymentFulfillment,
      ).toHaveBeenCalledWith({
        paymentFlowId: input.paymentFlowId,
        confirmationRefId: expect.any(String),
        correlationId: mockCardPaymentConfirmation.id,
      })
    })
  })

  describe('LOG_REFUND_SUCCESS', () => {
    it('should call logPaymentFlowUpdate with refund_completed', async () => {
      const { input, context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(saga, context, REFUND_SAGA_START_STEP)

      expect(mockPaymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentFlowId: input.paymentFlowId,
          type: 'success',
          reason: 'refund_completed',
          message: 'Payment successfully refunded',
          metadata: expect.objectContaining({
            reason: input.reasonForRefund,
          }),
        }),
        expect.objectContaining({ useRetry: true, throwOnError: false }),
      )
    })
  })

  describe('executes all steps in sequence', () => {
    it('REFUND_PAYMENT path completes all steps in order', async () => {
      const { context, saga, orchestrator } = setupSaga()
      const result = await orchestrator.execute(
        saga,
        context,
        REFUND_SAGA_START_STEP,
      )

      expect(result.success).toBe(true)
      expect(context.completedSteps).toEqual([
        'VALIDATE_REFUND',
        'DELETE_CARD_PAYMENT_CONFIRMATION',
        'REFUND_PAYMENT',
        'LOG_REFUND_SUCCESS',
      ])
    })

    it('DELETE_FJS_CHARGE path completes all steps in order', async () => {
      mockPaymentFlowService.findPaymentFulfillmentForPaymentFlow.mockResolvedValue(
        mockPaymentFulfillmentWithFjs,
      )

      const { context, saga, orchestrator } = setupSaga()
      const result = await orchestrator.execute(
        saga,
        context,
        REFUND_SAGA_START_STEP,
      )

      expect(result.success).toBe(true)
      expect(context.completedSteps).toEqual([
        'VALIDATE_REFUND',
        'DELETE_CARD_PAYMENT_CONFIRMATION',
        'DELETE_FJS_CHARGE',
        'LOG_REFUND_SUCCESS',
      ])
    })
  })

  describe('DELETE_CARD_PAYMENT_CONFIRMATION failure', () => {
    it('should throw and not call refund when deleteCardPaymentConfirmation returns null', async () => {
      mockPaymentFlowService.deleteCardPaymentConfirmation.mockResolvedValue(
        null,
      )

      const { context, saga, orchestrator } = setupSaga()

      await expect(
        orchestrator.execute(saga, context, REFUND_SAGA_START_STEP),
      ).rejects.toThrow(PaymentServiceCode.CouldNotDeletePaymentConfirmation)

      expect(
        mockCardPaymentService.refundWithCorrelationId,
      ).not.toHaveBeenCalled()
      expect(
        mockPaymentFlowService.restoreCardPaymentConfirmation,
      ).not.toHaveBeenCalled()
    })
  })

  describe('REFUND_PAYMENT failure triggers restore', () => {
    it('should call restore when REFUND_PAYMENT fails', async () => {
      mockCardPaymentService.refundWithCorrelationId.mockRejectedValue(
        new Error('Refund failed'),
      )

      const { input, context, saga, orchestrator } = setupSaga()

      await expect(
        orchestrator.execute(saga, context, REFUND_SAGA_START_STEP),
      ).rejects.toThrow('Refund failed')

      expect(
        mockPaymentFlowService.restoreCardPaymentConfirmation,
      ).toHaveBeenCalledWith(input.paymentFlowId, expect.any(String))
      expect(
        mockPaymentFlowService.restorePaymentFulfillment,
      ).toHaveBeenCalledWith({
        paymentFlowId: input.paymentFlowId,
        confirmationRefId: expect.any(String),
      })
      expect(context.metadata?.refundSucceededButRollbackFailed).toBeUndefined()
    })
  })

  describe('DELETE_FJS_CHARGE failure triggers restore', () => {
    beforeEach(() => {
      mockPaymentFlowService.findPaymentFulfillmentForPaymentFlow.mockResolvedValue(
        mockPaymentFulfillmentWithFjs,
      )
    })

    it('should call restore when DELETE_FJS_CHARGE fails', async () => {
      mockPaymentFlowService.deleteFjsCharge.mockRejectedValue(
        new Error('FJS delete failed'),
      )

      const { input, context, saga, orchestrator } = setupSaga()

      await expect(
        orchestrator.execute(saga, context, REFUND_SAGA_START_STEP),
      ).rejects.toThrow('FJS delete failed')

      expect(
        mockPaymentFlowService.restoreCardPaymentConfirmation,
      ).toHaveBeenCalledWith(input.paymentFlowId, expect.any(String))
      expect(
        mockPaymentFlowService.restorePaymentFulfillment,
      ).toHaveBeenCalledWith({
        paymentFlowId: input.paymentFlowId,
        confirmationRefId: expect.any(String),
      })
      expect(context.metadata?.refundSucceededButRollbackFailed).toBeUndefined()
    })
  })

  describe('REFUND_PAYMENT compensate', () => {
    it('should set refundSucceededButRollbackFailed when LOG_REFUND_SUCCESS fails after refund', async () => {
      mockPaymentFlowService.logPaymentFlowUpdate.mockImplementation(
        async (update: { reason?: string }) => {
          if (update.reason === 'refund_completed') {
            throw new Error('Log failed')
          }
          return undefined as never
        },
      )

      const { context, saga, orchestrator } = setupSaga()

      await expect(
        orchestrator.execute(saga, context, REFUND_SAGA_START_STEP),
      ).rejects.toThrow('Log failed')

      expect(context.metadata?.refundSucceededButRollbackFailed).toBe(true)
    })
  })

  describe('DELETE_FJS_CHARGE compensate', () => {
    beforeEach(() => {
      mockPaymentFlowService.findPaymentFulfillmentForPaymentFlow.mockResolvedValue(
        mockPaymentFulfillmentWithFjs,
      )
    })

    it('should set refundSucceededButRollbackFailed when LOG_REFUND_SUCCESS fails after FJS delete', async () => {
      mockPaymentFlowService.logPaymentFlowUpdate.mockImplementation(
        async (update: { reason?: string }) => {
          if (update.reason === 'refund_completed') {
            throw new Error('Log failed')
          }
          return undefined as never
        },
      )

      const { context, saga, orchestrator } = setupSaga()

      await expect(
        orchestrator.execute(saga, context, REFUND_SAGA_START_STEP),
      ).rejects.toThrow('Log failed')

      expect(context.metadata?.refundSucceededButRollbackFailed).toBe(true)
    })
  })
})
