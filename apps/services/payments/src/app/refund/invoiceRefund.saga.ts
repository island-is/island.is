import { Logger } from '@island.is/logging'
import { PaymentServiceCode } from '@island.is/shared/constants'
import { BadRequestException } from '@nestjs/common'
import { PaymentMethod, RefundType } from '../../types'
import { requireStepResult } from '../../utils/orchestrator'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { RefundPaymentInput } from './dtos/refundPayment.input'
import {
  InvoiceRefundContext,
  InvoiceRefundSagaDefinition,
} from './refund.orchestrator'

export const createInvoiceRefundContext = (
  paymentFlowId: string,
  input: RefundPaymentInput,
): InvoiceRefundContext => {
  return {
    paymentFlowId,
    paymentMethod: PaymentMethod.INVOICE,
    input,
    stepResults: {},
    completedSteps: [],
    startTime: new Date(),
  }
}

export const createInvoiceRefundSaga = (
  paymentFlowService: PaymentFlowService,
  logger: Logger,
): InvoiceRefundSagaDefinition => [
  {
    name: 'VALIDATE_INVOICE_REFUND',
    description: 'Validate the invoice payment flow is eligible for refund',
    execute: async (ctx) => {
      const paymentFulfillment =
        await paymentFlowService.findPaymentFulfillmentForPaymentFlow(
          ctx.paymentFlowId,
        )

      if (
        !paymentFulfillment ||
        paymentFulfillment.paymentMethod !== 'invoice'
      ) {
        throw new BadRequestException(
          PaymentServiceCode.PaymentFlowNotEligibleToBeRefunded,
        )
      }

      if (!paymentFulfillment.fjsChargeId) {
        throw new BadRequestException(
          PaymentServiceCode.PaymentFlowNotEligibleToBeRefunded,
        )
      }

      return { paymentFulfillment }
    },
  },
  {
    name: 'DELETE_INVOICE_FULFILLMENT',
    description:
      'Mark the invoice payment fulfillment as deleted to prevent double refunds',
    execute: async (ctx) => {
      const { paymentFulfillment } = requireStepResult(
        ctx,
        'VALIDATE_INVOICE_REFUND',
      )

      const deletedPaymentFulfillment =
        await paymentFlowService.deletePaymentFulfillment({
          paymentFlowId: ctx.paymentFlowId,
          confirmationRefId: paymentFulfillment.confirmationRefId,
          correlationId: paymentFulfillment.id,
        })

      if (!deletedPaymentFulfillment) {
        throw new BadRequestException(
          PaymentServiceCode.CouldNotDeletePaymentFulfillment,
        )
      }

      return { deletedPaymentFulfillment }
    },
    compensate: async (ctx) => {
      const { deletedPaymentFulfillment } = requireStepResult(
        ctx,
        'DELETE_INVOICE_FULFILLMENT',
      )

      if (deletedPaymentFulfillment) {
        logger.info(
          `[${ctx.paymentFlowId}] Restoring invoice payment fulfillment`,
        )
        await paymentFlowService.restorePaymentFulfillment({
          paymentFlowId: ctx.paymentFlowId,
          confirmationRefId: deletedPaymentFulfillment.confirmationRefId,
        })
      }
    },
  },
  {
    name: 'DELETE_FJS_CHARGE',
    description: 'Delete FJS charge to refund the invoice payment',
    execute: async (ctx) => {
      await paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId: ctx.paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.INVOICE,
        reason: 'refund_started',
        message: 'Invoice refund started because of fulfillment failure',
        metadata: {
          reasonForRefund: RefundType.FULFILLMENT_FAILURE,
          originalError: ctx.input.reasonForRefund,
        },
      })

      await paymentFlowService.deleteFjsCharge(ctx.paymentFlowId)

      return { action: 'deleted_fjs' as const }
    },
    compensate: async (ctx) => {
      ctx.metadata = {
        ...ctx.metadata,
        refundSucceededButRollbackFailed: true,
      }
    },
  },
  {
    name: 'LOG_REFUND_SUCCESS',
    description: 'Log successful invoice refund completion',
    execute: async (ctx) => {
      await paymentFlowService.logPaymentFlowUpdate(
        {
          paymentFlowId: ctx.paymentFlowId,
          type: 'success',
          occurredAt: new Date(),
          paymentMethod: PaymentMethod.INVOICE,
          reason: 'refund_completed',
          message: 'Invoice payment successfully refunded',
          metadata: {
            action: 'deleted_fjs',
            reason: ctx.input.reasonForRefund,
          },
        },
        {
          useRetry: true,
          throwOnError: false,
        },
      )
    },
  },
]
