import { BadRequestException } from '@nestjs/common'

import {
  PaymentServiceCode,
  DebtPaymentErrorCode,
} from '@island.is/shared/constants'

import { BankTransferService } from '../bankTransferPayment/bankTransfer.service'
import { DebtSettlementService } from '../debtPayment/debtSettlement.service'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { RefundController } from './refund.controller'
import { RefundService } from './refund.service'
import { RefundOrchestrationService } from './refundOrchestration.service'

const input = { paymentFlowId: 'flow-1', reasonForRefund: 'Requested' }
const refundResponse = {
  success: true,
  refundMethod: 'payment_gateway',
  message: 'Payment successfully refunded',
}

describe('RefundOrchestrationService', () => {
  let service: RefundOrchestrationService
  let paymentFlowService: { findPaymentFulfillmentForPaymentFlow: jest.Mock }
  let debtSettlementService: { findPossibleRegistration: jest.Mock }
  let handleCardRefund: jest.SpyInstance
  let logger: { info: jest.Mock; warn: jest.Mock; error: jest.Mock }

  beforeEach(() => {
    paymentFlowService = {
      findPaymentFulfillmentForPaymentFlow: jest
        .fn()
        .mockResolvedValue({ paymentMethod: 'card', fjsChargeId: null }),
    }
    debtSettlementService = {
      findPossibleRegistration: jest.fn().mockResolvedValue(null),
    }
    logger = { info: jest.fn(), warn: jest.fn(), error: jest.fn() }

    service = new RefundOrchestrationService(
      {} as RefundService,
      paymentFlowService as unknown as PaymentFlowService,
      {} as BankTransferService,
      debtSettlementService as unknown as DebtSettlementService,
      logger as never,
    )
    handleCardRefund = jest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .spyOn(service as any, 'handleCardRefund')
      .mockResolvedValue(refundResponse)
  })

  describe('refund', () => {
    it('refunds charge flows as before', async () => {
      await expect(service.refund(input)).resolves.toEqual(refundResponse)

      expect(handleCardRefund).toHaveBeenCalledTimes(1)
    })

    it.each(['registered', 'needs_reconciliation'])(
      'blocks a debt flow that is %s, quietly',
      async (status) => {
        debtSettlementService.findPossibleRegistration.mockResolvedValue({
          status,
          hadAmbiguousAttempt: false,
          isAttemptRunning: false,
        })

        await expect(service.refund(input)).rejects.toEqual(
          new BadRequestException(
            DebtPaymentErrorCode.DebtPaymentRegisteredCannotBeRefunded,
          ),
        )

        expect(handleCardRefund).not.toHaveBeenCalled()
        expect(logger.warn).not.toHaveBeenCalled()
      },
    )

    it('allows a debt flow that may not be registered', async () => {
      debtSettlementService.findPossibleRegistration.mockResolvedValue(null)

      await expect(service.refund(input)).resolves.toEqual(refundResponse)

      expect(logger.warn).not.toHaveBeenCalled()
    })

    it('blocks a pending debt flow that may be registered, with a warning', async () => {
      debtSettlementService.findPossibleRegistration.mockResolvedValue({
        status: 'pending',
        hadAmbiguousAttempt: true,
        isAttemptRunning: false,
      })

      await expect(service.refund(input)).rejects.toEqual(
        new BadRequestException(
          DebtPaymentErrorCode.DebtPaymentRegisteredCannotBeRefunded,
        ),
      )

      expect(handleCardRefund).not.toHaveBeenCalled()
      expect(logger.warn).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          debtRefundRefused: true,
          hadAmbiguousAttempt: true,
          isAttemptRunning: false,
        }),
      )
    })

    it.each(['registered', 'needs_reconciliation'])(
      'does not block system refunds of a debt flow that is %s',
      async (status) => {
        debtSettlementService.findPossibleRegistration.mockResolvedValue({
          status,
          hadAmbiguousAttempt: false,
          isAttemptRunning: false,
        })

        await expect(service.refund(input, { system: true })).resolves.toEqual(
          refundResponse,
        )

        expect(
          debtSettlementService.findPossibleRegistration,
        ).not.toHaveBeenCalled()
      },
    )

    it('looks at the flow being refunded', async () => {
      await service.refund(input)

      expect(
        debtSettlementService.findPossibleRegistration,
      ).toHaveBeenCalledWith('flow-1')
    })

    it('is not eligible when nothing was paid', async () => {
      paymentFlowService.findPaymentFulfillmentForPaymentFlow.mockResolvedValue(
        null,
      )

      await expect(service.refund(input)).rejects.toEqual(
        new BadRequestException(
          PaymentServiceCode.PaymentFlowNotEligibleToBeRefunded,
        ),
      )
    })
  })

  describe('a refund whose clean-up failed', () => {
    it('reports it with the refunded payment, so the worker does not refund again', async () => {
      const logPaymentFlowUpdate = jest.fn()
      ;(
        service as unknown as { paymentFlowService: unknown }
      ).paymentFlowService = { ...paymentFlowService, logPaymentFlowUpdate }

      const response = await (
        service as unknown as {
          handleRefundError: (...args: unknown[]) => Promise<unknown>
        }
      ).handleRefundError(
        new Error('Log failed'),
        {
          metadata: {
            refundSucceededButRollbackFailed: true,
            correlationId: 'payment-1',
          },
          failedStep: 'LOG_REFUND_SUCCESS',
          completedSteps: ['REFUND_PAYMENT'],
        },
        'flow-1',
        'card',
      )

      expect(response).toMatchObject({ success: true })
      expect(logPaymentFlowUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: 'refund_completed',
          metadata: expect.objectContaining({
            cleanupFailed: true,
            correlationId: 'payment-1',
          }),
        }),
      )
    })
  })

  describe('RefundController', () => {
    it('refunds on behalf of a caller, so the debt check applies', async () => {
      const refund = jest.fn().mockResolvedValue(refundResponse)
      const controller = new RefundController({
        refund,
      } as unknown as RefundOrchestrationService)

      await expect(controller.refund(input)).resolves.toEqual(refundResponse)

      expect(refund).toHaveBeenCalledWith(input)
    })
  })
})
