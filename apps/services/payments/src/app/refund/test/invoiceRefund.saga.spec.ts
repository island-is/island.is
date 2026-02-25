import type { Logger } from '@island.is/logging'
import { PaymentServiceCode } from '@island.is/shared/constants'

import { PaymentFlowService } from '../../paymentFlow/paymentFlow.service'
import {
  PaymentOrchestrator,
  InvoiceRefundContext,
  InvoiceRefundStepResults,
} from '../refund.orchestrator'
import {
  createInvoiceRefundContext,
  createInvoiceRefundSaga,
  INVOICE_REFUND_SAGA_START_STEP,
} from '../invoiceRefund.saga'
import {
  createMockLogger,
  createMockPaymentFlowService,
  getRefundInput,
  mockInvoicePaymentFulfillment,
} from './sagaTestUtils'

describe('Invoice Refund Saga', () => {
  let mockLogger: Logger
  let mockPaymentFlowService: jest.Mocked<PaymentFlowService>

  const setupSaga = (input = getRefundInput()) => {
    const context = createInvoiceRefundContext(input.paymentFlowId, input)
    const saga = createInvoiceRefundSaga(mockPaymentFlowService, mockLogger)
    const orchestrator = new PaymentOrchestrator<
      InvoiceRefundContext,
      InvoiceRefundStepResults
    >(mockLogger, mockPaymentFlowService)
    return { input, context, saga, orchestrator }
  }

  beforeEach(() => {
    mockLogger = createMockLogger()
    mockPaymentFlowService = createMockPaymentFlowService()
    mockPaymentFlowService.findPaymentFulfillmentForPaymentFlow.mockResolvedValue(
      mockInvoicePaymentFulfillment as never,
    )
  })

  describe('createInvoiceRefundContext', () => {
    it('should create context with paymentFlowId and input', () => {
      const input = getRefundInput()
      const context = createInvoiceRefundContext('flow-123', input)

      expect(context.paymentFlowId).toBe('flow-123')
      expect(context.input).toEqual(input)
      expect(context.paymentMethod).toBe('invoice')
      expect(context.stepResults).toEqual({})
      expect(context.completedSteps).toEqual([])
    })
  })

  describe('VALIDATE_INVOICE_REFUND', () => {
    it('should call findPaymentFulfillmentForPaymentFlow', async () => {
      const { input, context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(saga, context, INVOICE_REFUND_SAGA_START_STEP)

      expect(
        mockPaymentFlowService.findPaymentFulfillmentForPaymentFlow,
      ).toHaveBeenCalledWith(input.paymentFlowId)
    })

    it('should throw when payment fulfillment is missing', async () => {
      mockPaymentFlowService.findPaymentFulfillmentForPaymentFlow.mockResolvedValue(
        null,
      )

      const { context, saga, orchestrator } = setupSaga()

      await expect(
        orchestrator.execute(saga, context, INVOICE_REFUND_SAGA_START_STEP),
      ).rejects.toThrow(PaymentServiceCode.PaymentFlowNotEligibleToBeRefunded)
    })

    it('should throw when payment method is not invoice', async () => {
      mockPaymentFlowService.findPaymentFulfillmentForPaymentFlow.mockResolvedValue(
        {
          ...mockInvoicePaymentFulfillment,
          paymentMethod: 'card' as const,
        } as never,
      )

      const { context, saga, orchestrator } = setupSaga()

      await expect(
        orchestrator.execute(saga, context, INVOICE_REFUND_SAGA_START_STEP),
      ).rejects.toThrow(PaymentServiceCode.PaymentFlowNotEligibleToBeRefunded)
    })

    it('should throw when fjsChargeId is missing', async () => {
      mockPaymentFlowService.findPaymentFulfillmentForPaymentFlow.mockResolvedValue(
        {
          ...mockInvoicePaymentFulfillment,
          fjsChargeId: null,
        } as never,
      )

      const { context, saga, orchestrator } = setupSaga()

      await expect(
        orchestrator.execute(saga, context, INVOICE_REFUND_SAGA_START_STEP),
      ).rejects.toThrow(PaymentServiceCode.PaymentFlowNotEligibleToBeRefunded)
    })
  })

  describe('DELETE_INVOICE_FULFILLMENT', () => {
    it('should call deletePaymentFulfillment', async () => {
      const { input, context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(saga, context, INVOICE_REFUND_SAGA_START_STEP)

      expect(
        mockPaymentFlowService.deletePaymentFulfillment,
      ).toHaveBeenCalledWith({
        paymentFlowId: input.paymentFlowId,
        confirmationRefId: mockInvoicePaymentFulfillment.confirmationRefId,
        correlationId: mockInvoicePaymentFulfillment.id,
      })
    })

    it('should throw when deletePaymentFulfillment returns null', async () => {
      mockPaymentFlowService.deletePaymentFulfillment.mockResolvedValue(
        null as never,
      )

      const { context, saga, orchestrator } = setupSaga()

      await expect(
        orchestrator.execute(saga, context, INVOICE_REFUND_SAGA_START_STEP),
      ).rejects.toThrow(PaymentServiceCode.CouldNotDeletePaymentFulfillment)
    })
  })

  describe('DELETE_FJS_CHARGE', () => {
    it('should call deleteFjsCharge', async () => {
      const { input, context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(saga, context, INVOICE_REFUND_SAGA_START_STEP)

      expect(mockPaymentFlowService.deleteFjsCharge).toHaveBeenCalledWith(
        input.paymentFlowId,
      )
    })

    it('should log refund started', async () => {
      const { input, context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(saga, context, INVOICE_REFUND_SAGA_START_STEP)

      expect(mockPaymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentFlowId: input.paymentFlowId,
          reason: 'refund_started',
          message: 'Invoice refund started because of fulfillment failure',
        }),
      )
    })
  })

  describe('LOG_REFUND_SUCCESS', () => {
    it('should call logPaymentFlowUpdate with refund_completed', async () => {
      const { input, context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(saga, context, INVOICE_REFUND_SAGA_START_STEP)

      expect(mockPaymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentFlowId: input.paymentFlowId,
          type: 'success',
          reason: 'refund_completed',
          message: 'Invoice payment successfully refunded',
          metadata: expect.objectContaining({
            action: 'deleted_fjs',
            reason: input.reasonForRefund,
          }),
        }),
        expect.objectContaining({ useRetry: true, throwOnError: false }),
      )
    })
  })

  describe('executes all steps in sequence', () => {
    it('completes all steps in order', async () => {
      const { context, saga, orchestrator } = setupSaga()
      const result = await orchestrator.execute(
        saga,
        context,
        INVOICE_REFUND_SAGA_START_STEP,
      )

      expect(result.success).toBe(true)
      expect(context.completedSteps).toEqual([
        'VALIDATE_INVOICE_REFUND',
        'DELETE_INVOICE_FULFILLMENT',
        'DELETE_FJS_CHARGE',
        'LOG_REFUND_SUCCESS',
      ])
    })
  })

  describe('DELETE_FJS_CHARGE failure triggers restore', () => {
    it('should call restorePaymentFulfillment when DELETE_FJS_CHARGE fails', async () => {
      mockPaymentFlowService.deleteFjsCharge.mockRejectedValue(
        new Error('FJS delete failed'),
      )

      const { input, context, saga, orchestrator } = setupSaga()

      await expect(
        orchestrator.execute(saga, context, INVOICE_REFUND_SAGA_START_STEP),
      ).rejects.toThrow('FJS delete failed')

      expect(
        mockPaymentFlowService.restorePaymentFulfillment,
      ).toHaveBeenCalledWith({
        paymentFlowId: input.paymentFlowId,
        confirmationRefId: mockInvoicePaymentFulfillment.confirmationRefId,
      })
    })
  })

  describe('DELETE_FJS_CHARGE compensate', () => {
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
        orchestrator.execute(saga, context, INVOICE_REFUND_SAGA_START_STEP),
      ).rejects.toThrow('Log failed')

      expect(context.metadata?.refundSucceededButRollbackFailed).toBe(true)
    })
  })
})
