import { InferAttributes } from 'sequelize'

import { Logger } from '@island.is/logging'
import { PaymentServiceCode } from '@island.is/shared/constants'
import { BadRequestException } from '@nestjs/common'

import { PaymentMethod, RefundType } from '../../types'
import { environment } from '../../environments'
import { requireStepResult } from '../../utils/orchestrator'
import { BankTransferService } from '../bankTransferPayment/bankTransfer.service'
import { generateBankTransferChargeFJSPayload } from '../bankTransferPayment/bankTransfer.utils'
import { PaymentFulfillment } from '../paymentFlow/models/paymentFulfillment.model'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { RefundPaymentInput } from './dtos/refundPayment.input'
import {
  BankTransferRefundContext,
  BankTransferRefundSagaDefinition,
} from './refund.orchestrator'

export const BANK_TRANSFER_REFUND_SAGA_START_STEP = 'VALIDATE_REFUND'

export const createBankTransferRefundContext = (
  paymentFlowId: string,
  input: RefundPaymentInput,
  paymentFulfillment: InferAttributes<PaymentFulfillment>,
): BankTransferRefundContext => {
  return {
    paymentFlowId,
    paymentMethod: PaymentMethod.BANK_TRANSFER,
    input,
    paymentFulfillment,
    stepResults: {},
    completedSteps: [],
    startTime: new Date(),
  }
}

export const createBankTransferRefundSaga = (
  paymentFlowService: PaymentFlowService,
  bankTransferService: BankTransferService,
  logger: Logger,
): BankTransferRefundSagaDefinition => ({
  VALIDATE_REFUND: {
    name: 'VALIDATE_REFUND',
    description:
      'Validate the bank transfer payment flow is eligible for refund',
    execute: async (ctx) => {
      if (ctx.paymentFulfillment.fjsChargeId) {
        return { needsFjsCreate: false as const }
      }

      const providerPaymentId =
        await bankTransferService.getRefundableProviderPaymentId(
          ctx.paymentFlowId,
        )

      if (!providerPaymentId) {
        throw new BadRequestException(
          PaymentServiceCode.PaymentFlowNotEligibleToBeRefunded,
        )
      }

      return {
        needsFjsCreate: true as const,
        providerPaymentId,
      }
    },
    nextStep: 'DELETE_BANK_TRANSFER_FULFILLMENT',
  },
  DELETE_BANK_TRANSFER_FULFILLMENT: {
    name: 'DELETE_BANK_TRANSFER_FULFILLMENT',
    description:
      'Mark the bank transfer payment fulfillment as deleted to prevent double refunds',
    execute: async (ctx) => {
      const deletedPaymentFulfillment =
        await paymentFlowService.deletePaymentFulfillment({
          paymentFlowId: ctx.paymentFlowId,
          confirmationRefId: ctx.paymentFulfillment.confirmationRefId,
          correlationId: ctx.paymentFulfillment.id,
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
        'DELETE_BANK_TRANSFER_FULFILLMENT',
      )

      if (deletedPaymentFulfillment) {
        logger.info(
          `[${ctx.paymentFlowId}] Restoring bank transfer payment fulfillment`,
        )
        await paymentFlowService.restorePaymentFulfillment({
          paymentFlowId: ctx.paymentFlowId,
          confirmationRefId: deletedPaymentFulfillment.confirmationRefId,
        })
      }
    },
    nextStep: (ctx) =>
      ctx.stepResults.VALIDATE_REFUND?.needsFjsCreate
        ? 'ENSURE_FJS_CHARGE'
        : 'DELETE_FJS_CHARGE',
  },
  ENSURE_FJS_CHARGE: {
    name: 'ENSURE_FJS_CHARGE',
    description:
      'Create the missing FJS charge before refunding when the original create failed at settlement',
    execute: async (ctx) => {
      const validation = requireStepResult(ctx, 'VALIDATE_REFUND')

      if (!validation.needsFjsCreate) {
        throw new Error(
          'ENSURE_FJS_CHARGE invoked without needsFjsCreate — saga routing bug',
        )
      }

      const paymentFlow = await paymentFlowService.getPaymentFlowDetails(
        ctx.paymentFlowId,
      )
      const { catalogItems, totalPrice } =
        await paymentFlowService.getPaymentFlowChargeDetails(
          paymentFlow.organisationId,
          paymentFlow.charges,
        )

      const chargePayload = generateBankTransferChargeFJSPayload({
        paymentFlow,
        charges: catalogItems,
        totalPrice,
        systemId: environment.chargeFjs.systemId,
        providerPaymentId: validation.providerPaymentId,
        // The fulfillment's confirmationRefId is the bank-transfer correlationId.
        correlationId: ctx.paymentFulfillment.confirmationRefId,
        // Re-creating a charge that failed at settlement: the original payment date is when the
        // fulfillment was recorded, not now.
        effectiveDate: new Date(ctx.paymentFulfillment.created),
      })

      await paymentFlowService.createFjsCharge(ctx.paymentFlowId, chargePayload)

      return { action: 'created_for_refund' as const }
    },
    nextStep: 'DELETE_FJS_CHARGE',
  },
  DELETE_FJS_CHARGE: {
    name: 'DELETE_FJS_CHARGE',
    description: 'Delete FJS charge to refund the bank transfer payment',
    execute: async (ctx) => {
      await paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId: ctx.paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        reason: 'refund_started',
        message: 'Bank transfer refund started because of fulfillment failure',
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
    nextStep: 'LOG_REFUND_SUCCESS',
  },
  LOG_REFUND_SUCCESS: {
    name: 'LOG_REFUND_SUCCESS',
    description: 'Log successful bank transfer refund completion',
    execute: async (ctx) => {
      await paymentFlowService.logPaymentFlowUpdate(
        {
          paymentFlowId: ctx.paymentFlowId,
          type: 'success',
          occurredAt: new Date(),
          paymentMethod: PaymentMethod.BANK_TRANSFER,
          reason: 'refund_completed',
          message: 'Bank transfer payment successfully refunded',
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
})
