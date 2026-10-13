import { BadRequestException } from '@nestjs/common'

import { PaymentServiceCode } from '@island.is/shared/constants'

import { BankTransferService } from '../bankTransferPayment/bankTransfer.service'
import { FjsDebtPayment } from '../paymentFlow/models/fjsDebtPayment.model'
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
  let fjsDebtPaymentModel: { findOne: jest.Mock }
  let handleCardRefund: jest.SpyInstance

  beforeEach(() => {
    paymentFlowService = {
      findPaymentFulfillmentForPaymentFlow: jest
        .fn()
        .mockResolvedValue({ paymentMethod: 'card', fjsChargeId: null }),
    }
    fjsDebtPaymentModel = { findOne: jest.fn().mockResolvedValue(null) }

    service = new RefundOrchestrationService(
      {} as RefundService,
      paymentFlowService as unknown as PaymentFlowService,
      {} as BankTransferService,
      fjsDebtPaymentModel as unknown as typeof FjsDebtPayment,
      { info: jest.fn(), warn: jest.fn(), error: jest.fn() } as never,
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
      'blocks a debt flow that is %s',
      async (status) => {
        fjsDebtPaymentModel.findOne.mockResolvedValue({ status })

        await expect(service.refund(input)).rejects.toEqual(
          new BadRequestException(
            PaymentServiceCode.DebtPaymentRegisteredCannotBeRefunded,
          ),
        )

        expect(handleCardRefund).not.toHaveBeenCalled()
      },
    )

    it.each(['pending', 'rejected'])(
      'allows a debt flow that is %s',
      async (status) => {
        fjsDebtPaymentModel.findOne.mockResolvedValue({ status })

        await expect(service.refund(input)).resolves.toEqual(refundResponse)
      },
    )

    it.each(['registered', 'needs_reconciliation'])(
      'does not block system refunds of a debt flow that is %s',
      async (status) => {
        fjsDebtPaymentModel.findOne.mockResolvedValue({ status })

        await expect(service.refund(input, { system: true })).resolves.toEqual(
          refundResponse,
        )

        expect(fjsDebtPaymentModel.findOne).not.toHaveBeenCalled()
      },
    )

    it('looks at the row of the flow being refunded', async () => {
      await service.refund(input)

      expect(fjsDebtPaymentModel.findOne).toHaveBeenCalledWith({
        where: { paymentFlowId: 'flow-1' },
      })
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
