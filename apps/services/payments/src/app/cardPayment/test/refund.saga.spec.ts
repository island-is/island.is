import { v4 as uuid } from 'uuid'

import type { Logger } from '@island.is/logging'
import { PaymentServiceCode } from '@island.is/shared/constants'

import { PaymentFlowService } from '../../paymentFlow/paymentFlow.service'
import {
  PaymentOrchestrator,
  RefundContext,
  RefundStepResults,
} from '../cardPayment.orchestrator'
import { CardPaymentService } from '../cardPayment.service'
import { RefundCardPaymentInput } from '../dtos'
import {
  createRefundContext,
  createRefundSaga,
  REFUND_SAGA_START_STEP,
} from '../refund.saga'

const createMockLogger = (): Logger =>
  ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
    child: jest.fn(),
  } as unknown as Logger)

const mockPaymentFulfillmentWithFjs = {
  id: uuid(),
  paymentFlowId: 'payment-flow-id',
  confirmationRefId: 'confirmation-id',
  paymentMethod: 'card' as const,
  fjsChargeId: 'fjs-charge-id',
  isDeleted: false,
  created: new Date(),
  modified: new Date(),
}

const mockPaymentFulfillmentWithoutFjs = {
  ...mockPaymentFulfillmentWithFjs,
  fjsChargeId: null,
}

const mockCardPaymentConfirmation = {
  id: 'confirmation-id',
  paymentFlowId: 'payment-flow-id',
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

const getRefundInput = (): RefundCardPaymentInput => ({
  paymentFlowId: 'payment-flow-id',
  reasonForRefund: 'fulfillment_failure',
})

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

    mockPaymentFlowService = {
      findPaymentFulfillmentForPaymentFlow: jest
        .fn()
        .mockResolvedValue(mockPaymentFulfillmentWithoutFjs),
      getCardPaymentConfirmationForPaymentFlow: jest
        .fn()
        .mockResolvedValue(mockCardPaymentConfirmation),
      logPaymentFlowUpdate: jest.fn().mockResolvedValue(undefined),
      deleteFjsCharge: jest.fn().mockResolvedValue(undefined),
      deleteCardPaymentConfirmation: jest.fn().mockResolvedValue({
        id: uuid(),
        paymentFlowId: 'payment-flow-id',
      }),
      deletePaymentFulfillment: jest.fn().mockResolvedValue({}),
    } as unknown as jest.Mocked<PaymentFlowService>
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
    it('REFUND_PAYMENT path completes all steps', async () => {
      const { context, saga, orchestrator } = setupSaga()
      const result = await orchestrator.execute(
        saga,
        context,
        REFUND_SAGA_START_STEP,
      )

      expect(result.success).toBe(true)
      expect(context.completedSteps).toContain('VALIDATE_REFUND')
      expect(context.completedSteps).toContain('REFUND_PAYMENT')
      expect(context.completedSteps).toContain(
        'DELETE_CARD_PAYMENT_CONFIRMATION',
      )
      expect(context.completedSteps).toContain('LOG_REFUND_SUCCESS')
    })

    it('DELETE_FJS_CHARGE path completes all steps', async () => {
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
      expect(context.completedSteps).toContain('VALIDATE_REFUND')
      expect(context.completedSteps).toContain('DELETE_FJS_CHARGE')
      expect(context.completedSteps).toContain(
        'DELETE_CARD_PAYMENT_CONFIRMATION',
      )
      expect(context.completedSteps).toContain('LOG_REFUND_SUCCESS')
    })
  })

  describe('REFUND_PAYMENT compensate', () => {
    it('should set refundSucceededButRollbackFailed when DELETE_CARD_PAYMENT_CONFIRMATION fails', async () => {
      mockPaymentFlowService.deleteCardPaymentConfirmation.mockRejectedValue(
        new Error('Database error'),
      )

      const { context, saga, orchestrator } = setupSaga()

      await expect(
        orchestrator.execute(saga, context, REFUND_SAGA_START_STEP),
      ).rejects.toThrow('Database error')

      expect(context.metadata?.refundSucceededButRollbackFailed).toBe(true)
    })
  })

  describe('DELETE_FJS_CHARGE compensate', () => {
    beforeEach(() => {
      mockPaymentFlowService.findPaymentFulfillmentForPaymentFlow.mockResolvedValue(
        mockPaymentFulfillmentWithFjs,
      )
    })

    it('should set refundSucceededButRollbackFailed when DELETE_CARD_PAYMENT_CONFIRMATION fails after FJS delete', async () => {
      mockPaymentFlowService.deleteCardPaymentConfirmation.mockRejectedValue(
        new Error('Database error'),
      )

      const { context, saga, orchestrator } = setupSaga()

      await expect(
        orchestrator.execute(saga, context, REFUND_SAGA_START_STEP),
      ).rejects.toThrow('Database error')

      expect(context.metadata?.refundSucceededButRollbackFailed).toBe(true)
    })
  })
})
