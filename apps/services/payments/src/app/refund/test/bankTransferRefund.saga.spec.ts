import { v4 as uuid } from 'uuid'
import { InferAttributes } from 'sequelize'
import { jest } from '@jest/globals'

import type { Logger } from '@island.is/logging'
import { PaymentServiceCode } from '@island.is/shared/constants'
import { PayInfoPaymentMeansEnum } from '@island.is/clients/charge-fjs-v2'

import { BankTransferService } from '../../bankTransferPayment/bankTransfer.service'
import { PaymentFulfillment } from '../../paymentFlow/models/paymentFulfillment.model'
import { PaymentFlowService } from '../../paymentFlow/paymentFlow.service'
import {
  BankTransferRefundContext,
  BankTransferRefundStepResults,
  PaymentOrchestrator,
} from '../refund.orchestrator'
import {
  createBankTransferRefundContext,
  createBankTransferRefundSaga,
  BANK_TRANSFER_REFUND_SAGA_START_STEP,
} from '../bankTransferRefund.saga'
import {
  createMockLogger,
  createMockPaymentFlowService,
  getRefundInput,
  PAYMENT_FLOW_ID,
} from './sagaTestUtils'

const resolved = <T>(v: T): never => v as never

const mockBankTransferFulfillmentWithFjs: InferAttributes<PaymentFulfillment> =
  {
    id: uuid(),
    paymentFlowId: PAYMENT_FLOW_ID,
    confirmationRefId: uuid(),
    paymentMethod: 'bank_transfer',
    fjsChargeId: 'fjs-charge-id',
    isDeleted: false,
    created: new Date(),
    modified: new Date(),
  }

const mockBankTransferFulfillmentWithoutFjs: InferAttributes<PaymentFulfillment> =
  {
    ...mockBankTransferFulfillmentWithFjs,
    id: uuid(),
    confirmationRefId: uuid(),
    fjsChargeId: null,
  }

const SUCCESS_PROVIDER_PAYMENT_ID = 'blikk-payment-id'
const SOFT_DELETED_ROW_ID = 'bank-transfer-row-id'

const createMockBankTransferService = (
  providerPaymentId: string | null = SUCCESS_PROVIDER_PAYMENT_ID,
): jest.Mocked<BankTransferService> =>
  ({
    getRefundableProviderPaymentId: jest
      .fn()
      .mockResolvedValue(resolved(providerPaymentId)),
    softDeleteRowForRefund: jest
      .fn()
      .mockResolvedValue(resolved(SOFT_DELETED_ROW_ID)),
    restoreRow: jest.fn().mockResolvedValue(resolved(undefined)),
  } as unknown as jest.Mocked<BankTransferService>)

describe('Bank Transfer Refund Saga', () => {
  let mockLogger: Logger
  let mockPaymentFlowService: jest.Mocked<PaymentFlowService>
  let mockBankTransferService: jest.Mocked<BankTransferService>

  const setupSaga = (
    paymentFulfillment: InferAttributes<PaymentFulfillment> = mockBankTransferFulfillmentWithFjs,
    refundableProviderPaymentId: string | null = SUCCESS_PROVIDER_PAYMENT_ID,
    input = getRefundInput(),
  ) => {
    mockBankTransferService = createMockBankTransferService(
      refundableProviderPaymentId,
    )
    const context = createBankTransferRefundContext(
      input.paymentFlowId,
      input,
      paymentFulfillment,
    )
    const saga = createBankTransferRefundSaga(
      mockPaymentFlowService,
      mockBankTransferService,
      mockLogger,
    )
    const orchestrator = new PaymentOrchestrator<
      BankTransferRefundContext,
      BankTransferRefundStepResults
    >(mockLogger, mockPaymentFlowService)
    return { input, context, saga, orchestrator }
  }

  beforeEach(() => {
    mockLogger = createMockLogger()
    mockPaymentFlowService = createMockPaymentFlowService({
      deletePaymentFulfillment: jest
        .fn()
        .mockResolvedValue(resolved(mockBankTransferFulfillmentWithFjs)),
      getPaymentFlowDetails: jest.fn().mockResolvedValue(
        resolved({
          id: PAYMENT_FLOW_ID,
          organisationId: 'org-id',
          charges: [],
          payerNationalId: '0000000000',
          availablePaymentMethods: ['bank_transfer'],
        }),
      ),
      getPaymentFlowChargeDetails: jest.fn().mockResolvedValue(
        resolved({
          catalogItems: [
            {
              chargeItemName: 'Item',
              chargeItemCode: 'CODE',
              priceAmount: 1000,
              quantity: 1,
            },
          ],
          totalPrice: 1000,
        }),
      ),
      createFjsCharge: jest.fn().mockResolvedValue(
        resolved({
          id: 'new-fjs-charge-id',
          receptionID: 'reception-id',
          user4: 'user4',
        }),
      ),
    })
  })

  describe('createBankTransferRefundContext', () => {
    it('should create context with paymentFlowId, input, and paymentFulfillment', () => {
      const input = getRefundInput()
      const context = createBankTransferRefundContext(
        'flow-123',
        input,
        mockBankTransferFulfillmentWithFjs,
      )

      expect(context.paymentFlowId).toBe('flow-123')
      expect(context.input).toEqual(input)
      expect(context.paymentMethod).toBe('bank_transfer')
      expect(context.paymentFulfillment).toEqual(
        mockBankTransferFulfillmentWithFjs,
      )
      expect(context.stepResults).toEqual({})
      expect(context.completedSteps).toEqual([])
    })
  })

  describe('VALIDATE_REFUND', () => {
    it('returns needsFjsCreate=false when fjsChargeId is present', async () => {
      const { context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(
        saga,
        context,
        BANK_TRANSFER_REFUND_SAGA_START_STEP,
      )

      expect(context.stepResults.VALIDATE_REFUND).toEqual({
        needsFjsCreate: false,
      })
      expect(
        mockBankTransferService.getRefundableProviderPaymentId,
      ).not.toHaveBeenCalled()
    })

    it('returns needsFjsCreate=true with providerPaymentId when fjsChargeId is missing and bank transfer is SUCCESS', async () => {
      const { context, saga, orchestrator } = setupSaga(
        mockBankTransferFulfillmentWithoutFjs,
      )
      await orchestrator.execute(
        saga,
        context,
        BANK_TRANSFER_REFUND_SAGA_START_STEP,
      )

      expect(context.stepResults.VALIDATE_REFUND).toEqual({
        needsFjsCreate: true,
        providerPaymentId: SUCCESS_PROVIDER_PAYMENT_ID,
      })
    })

    it('throws PaymentFlowNotEligibleToBeRefunded when fjsChargeId is missing and the bank transfer is not refundable', async () => {
      const { context, saga, orchestrator } = setupSaga(
        mockBankTransferFulfillmentWithoutFjs,
        null,
      )

      await expect(
        orchestrator.execute(
          saga,
          context,
          BANK_TRANSFER_REFUND_SAGA_START_STEP,
        ),
      ).rejects.toThrow(PaymentServiceCode.PaymentFlowNotEligibleToBeRefunded)
    })
  })

  describe('DELETE_BANK_TRANSFER_FULFILLMENT', () => {
    it('should call deletePaymentFulfillment', async () => {
      const { input, context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(
        saga,
        context,
        BANK_TRANSFER_REFUND_SAGA_START_STEP,
      )

      expect(
        mockPaymentFlowService.deletePaymentFulfillment,
      ).toHaveBeenCalledWith({
        paymentFlowId: input.paymentFlowId,
        confirmationRefId: mockBankTransferFulfillmentWithFjs.confirmationRefId,
        correlationId: mockBankTransferFulfillmentWithFjs.id,
      })
    })

    it('soft-deletes the bank transfer row and records its id', async () => {
      const { input, context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(
        saga,
        context,
        BANK_TRANSFER_REFUND_SAGA_START_STEP,
      )

      expect(
        mockBankTransferService.softDeleteRowForRefund,
      ).toHaveBeenCalledWith(input.paymentFlowId)
      expect(
        context.stepResults.DELETE_BANK_TRANSFER_FULFILLMENT?.softDeletedRowId,
      ).toBe(SOFT_DELETED_ROW_ID)
    })

    it('should throw when deletePaymentFulfillment returns null', async () => {
      mockPaymentFlowService.deletePaymentFulfillment.mockResolvedValue(
        null as never,
      )

      const { context, saga, orchestrator } = setupSaga()

      await expect(
        orchestrator.execute(
          saga,
          context,
          BANK_TRANSFER_REFUND_SAGA_START_STEP,
        ),
      ).rejects.toThrow(PaymentServiceCode.CouldNotDeletePaymentFulfillment)
    })
  })

  describe('ENSURE_FJS_CHARGE', () => {
    it('is skipped entirely when fjsChargeId is present', async () => {
      const { context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(
        saga,
        context,
        BANK_TRANSFER_REFUND_SAGA_START_STEP,
      )

      expect(mockPaymentFlowService.createFjsCharge).not.toHaveBeenCalled()
      expect(context.stepResults.ENSURE_FJS_CHARGE).toBeUndefined()
      expect(context.completedSteps).not.toContain('ENSURE_FJS_CHARGE')
    })

    it('creates FJS charge with the bank transfer payInfo when missing', async () => {
      const { input, context, saga, orchestrator } = setupSaga(
        mockBankTransferFulfillmentWithoutFjs,
      )
      await orchestrator.execute(
        saga,
        context,
        BANK_TRANSFER_REFUND_SAGA_START_STEP,
      )

      expect(mockPaymentFlowService.createFjsCharge).toHaveBeenCalledTimes(1)
      const [paymentFlowId, payload] =
        mockPaymentFlowService.createFjsCharge.mock.calls[0]
      expect(paymentFlowId).toBe(input.paymentFlowId)
      expect(payload.payInfo).toEqual(
        expect.objectContaining({
          RRN: SUCCESS_PROVIDER_PAYMENT_ID,
          payableAmount: 1000,
          paymentMeans: PayInfoPaymentMeansEnum.Milli,
          // correlationId is the fulfillment's confirmationRefId.
          correlationId:
            mockBankTransferFulfillmentWithoutFjs.confirmationRefId,
        }),
      )
      expect(context.stepResults.ENSURE_FJS_CHARGE).toEqual({
        action: 'created_for_refund',
      })
    })
  })

  describe('DELETE_FJS_CHARGE', () => {
    it('should call deleteFjsCharge', async () => {
      const { input, context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(
        saga,
        context,
        BANK_TRANSFER_REFUND_SAGA_START_STEP,
      )

      expect(mockPaymentFlowService.deleteFjsCharge).toHaveBeenCalledWith(
        input.paymentFlowId,
      )
    })

    it('should log refund started with bank_transfer paymentMethod', async () => {
      const { input, context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(
        saga,
        context,
        BANK_TRANSFER_REFUND_SAGA_START_STEP,
      )

      expect(mockPaymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentFlowId: input.paymentFlowId,
          paymentMethod: 'bank_transfer',
          reason: 'refund_started',
          message:
            'Bank transfer refund started because of fulfillment failure',
        }),
      )
    })
  })

  describe('LOG_REFUND_SUCCESS', () => {
    it('should call logPaymentFlowUpdate with refund_completed', async () => {
      const { input, context, saga, orchestrator } = setupSaga()
      await orchestrator.execute(
        saga,
        context,
        BANK_TRANSFER_REFUND_SAGA_START_STEP,
      )

      expect(mockPaymentFlowService.logPaymentFlowUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentFlowId: input.paymentFlowId,
          type: 'success',
          paymentMethod: 'bank_transfer',
          reason: 'refund_completed',
          message: 'Bank transfer payment successfully refunded',
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
    it('skips ENSURE_FJS_CHARGE when the fulfillment already has an FJS charge', async () => {
      const { context, saga, orchestrator } = setupSaga()
      const result = await orchestrator.execute(
        saga,
        context,
        BANK_TRANSFER_REFUND_SAGA_START_STEP,
      )

      expect(result.success).toBe(true)
      expect(context.completedSteps).toEqual([
        'VALIDATE_REFUND',
        'DELETE_BANK_TRANSFER_FULFILLMENT',
        'DELETE_FJS_CHARGE',
        'LOG_REFUND_SUCCESS',
      ])
    })

    it('completes all steps in order when creating the missing FJS charge', async () => {
      const { context, saga, orchestrator } = setupSaga(
        mockBankTransferFulfillmentWithoutFjs,
      )
      const result = await orchestrator.execute(
        saga,
        context,
        BANK_TRANSFER_REFUND_SAGA_START_STEP,
      )

      expect(result.success).toBe(true)
      expect(context.completedSteps).toEqual([
        'VALIDATE_REFUND',
        'DELETE_BANK_TRANSFER_FULFILLMENT',
        'ENSURE_FJS_CHARGE',
        'DELETE_FJS_CHARGE',
        'LOG_REFUND_SUCCESS',
      ])
    })
  })

  describe('DELETE_FJS_CHARGE failure triggers restore', () => {
    it('restores both the fulfillment and the bank transfer row when DELETE_FJS_CHARGE fails', async () => {
      // A failed FJS deletion is the only refund mechanism for bank transfer, so it must fail the
      // saga (not silently swallow) and roll back the row + fulfillment soft-deletes.
      mockPaymentFlowService.deleteFjsCharge.mockRejectedValue(
        new Error('FJS delete failed'),
      )

      const { input, context, saga, orchestrator } = setupSaga()

      await expect(
        orchestrator.execute(
          saga,
          context,
          BANK_TRANSFER_REFUND_SAGA_START_STEP,
        ),
      ).rejects.toThrow('FJS delete failed')

      expect(
        mockPaymentFlowService.restorePaymentFulfillment,
      ).toHaveBeenCalledWith({
        paymentFlowId: input.paymentFlowId,
        confirmationRefId: mockBankTransferFulfillmentWithFjs.confirmationRefId,
      })
      expect(mockBankTransferService.restoreRow).toHaveBeenCalledWith(
        SOFT_DELETED_ROW_ID,
      )
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
        orchestrator.execute(
          saga,
          context,
          BANK_TRANSFER_REFUND_SAGA_START_STEP,
        ),
      ).rejects.toThrow('Log failed')

      expect(context.metadata?.refundSucceededButRollbackFailed).toBe(true)
    })
  })
})
