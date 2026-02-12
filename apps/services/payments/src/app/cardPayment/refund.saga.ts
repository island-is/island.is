import { Logger } from '@island.is/logging'
import { PaymentServiceCode } from '@island.is/shared/constants'
import { retry } from '@island.is/shared/utils/server'
import { BadRequestException } from '@nestjs/common'
import { PaymentMethod, RefundType } from '../../types'
import { hasStepResult, requireStepResult } from '../../utils/orchestrator'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { RefundContext, RefundSagaDefinition } from './cardPayment.orchestrator'
import { CardPaymentService } from './cardPayment.service'
import { RefundCardPaymentInput } from './dtos'

export const REFUND_SAGA_START_STEP = 'VALIDATE_REFUND'

export const createRefundContext = (
  paymentFlowId: string,
  input: RefundCardPaymentInput,
): RefundContext => {
  return {
    paymentFlowId,
    paymentMethod: PaymentMethod.CARD,
    input,
    stepResults: {},
    completedSteps: [],
    startTime: new Date(),
  }
}

const logRefundStarted = (
  paymentFlowService: PaymentFlowService,
  ctx: RefundContext,
) =>
  paymentFlowService.logPaymentFlowUpdate({
    paymentFlowId: ctx.paymentFlowId,
    type: 'update',
    occurredAt: new Date(),
    paymentMethod: PaymentMethod.CARD,
    reason: 'refund_started',
    message: 'Refund started because of fulfillment failure',
    metadata: {
      reasonForRefund: RefundType.FULFILLMENT_FAILURE,
      originalError: ctx.input.reasonForRefund,
    },
  })

export const createRefundSaga = (
  cardPaymentService: CardPaymentService,
  paymentFlowService: PaymentFlowService,
  logger: Logger,
): RefundSagaDefinition => ({
  VALIDATE_REFUND: {
    name: 'VALIDATE_REFUND',
    description: 'Validate the payment flow is eligible for refund',
    execute: async (ctx) => {
      const [paymentFulfillment, cardPaymentConfirmation] = await Promise.all([
        paymentFlowService.findPaymentFulfillmentForPaymentFlow(
          ctx.paymentFlowId,
        ),
        paymentFlowService.getCardPaymentConfirmationForPaymentFlow(
          ctx.paymentFlowId,
        ),
      ])

      if (
        !paymentFulfillment ||
        paymentFulfillment.paymentMethod !== 'card' ||
        !cardPaymentConfirmation
      ) {
        throw new BadRequestException(
          PaymentServiceCode.PaymentFlowNotEligibleToBeRefunded,
        )
      }

      const hasFjsCharge = !!paymentFulfillment.fjsChargeId

      return {
        paymentFulfillment,
        cardPaymentConfirmation,
        hasFjsCharge,
      }
    },
    nextStep: 'DELETE_CARD_PAYMENT_CONFIRMATION',
  },
  DELETE_CARD_PAYMENT_CONFIRMATION: {
    name: 'DELETE_CARD_PAYMENT_CONFIRMATION',
    description:
      'Mark the card payment confirmation and payment fulfillment records as deleted to prevent double refunds',
    execute: async (ctx) => {
      const { cardPaymentConfirmation } = requireStepResult(
        ctx,
        'VALIDATE_REFUND',
      )

      const deletedPaymentConfirmation =
        await paymentFlowService.deleteCardPaymentConfirmation(
          ctx.paymentFlowId,
          cardPaymentConfirmation.id,
        )

      if (!deletedPaymentConfirmation) {
        throw new BadRequestException(
          PaymentServiceCode.CouldNotDeletePaymentConfirmation,
        )
      }

      const deletedPaymentFulfillment =
        await paymentFlowService.deletePaymentFulfillment({
          paymentFlowId: ctx.paymentFlowId,
          confirmationRefId: deletedPaymentConfirmation.id,
          correlationId: cardPaymentConfirmation.id,
        })

      if (!deletedPaymentFulfillment) {
        throw new BadRequestException(
          PaymentServiceCode.CouldNotDeletePaymentFulfillment,
        )
      }

      return {
        deletedPaymentConfirmation,
        deletedPaymentFulfillment,
      }
    },
    compensate: async (ctx) => {
      const { deletedPaymentConfirmation, deletedPaymentFulfillment } =
        requireStepResult(ctx, 'DELETE_CARD_PAYMENT_CONFIRMATION')

      if (deletedPaymentConfirmation) {
        logger.info(
          `[${ctx.paymentFlowId}][REFUND] Restoring payment confirmation after refund step failed`,
        )
        await paymentFlowService.restoreCardPaymentConfirmation(
          ctx.paymentFlowId,
          deletedPaymentConfirmation.id,
        )
      }

      if (deletedPaymentFulfillment && deletedPaymentConfirmation) {
        logger.info(
          `[${ctx.paymentFlowId}][REFUND] Restoring payment fulfillment after refund step failed`,
        )
        await paymentFlowService.restorePaymentFulfillment({
          paymentFlowId: ctx.paymentFlowId,
          confirmationRefId: deletedPaymentConfirmation.id,
        })
      }
    },
    nextStep: (ctx) =>
      ctx.stepResults.VALIDATE_REFUND?.hasFjsCharge
        ? 'DELETE_FJS_CHARGE'
        : 'REFUND_PAYMENT',
  },
  DELETE_FJS_CHARGE: {
    name: 'DELETE_FJS_CHARGE',
    description: 'Delete FJS charge',
    execute: async (ctx) => {
      await logRefundStarted(paymentFlowService, ctx)

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
  REFUND_PAYMENT: {
    name: 'REFUND_PAYMENT',
    description: 'Execute refund via payment gateway',
    execute: async (ctx) => {
      const { cardPaymentConfirmation } = requireStepResult(
        ctx,
        'VALIDATE_REFUND',
      )

      await logRefundStarted(paymentFlowService, ctx)

      logger.info(
        `[${ctx.paymentFlowId}][REFUND] Refunding via payment gateway`,
      )
      const refundResult = await retry(() =>
        cardPaymentService.refundWithCorrelationId({
          paymentTrackingData: {
            merchantReferenceData:
              cardPaymentConfirmation.merchantReferenceData,
            correlationId: cardPaymentConfirmation.id,
            paymentDate: new Date(cardPaymentConfirmation.created),
          },
        }),
      )
      logger.info(`[${ctx.paymentFlowId}][REFUND] Refund executed successfully`)

      return { action: 'refunded' as const, refundResult }
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
    description: 'Log successful refund completion',
    execute: async (ctx) => {
      const metadata = hasStepResult(ctx, 'REFUND_PAYMENT')
        ? {
            refund: requireStepResult(ctx, 'REFUND_PAYMENT').refundResult,
            reason: ctx.input.reasonForRefund,
          }
        : {
            action: 'deleted_fjs',
            reason: ctx.input.reasonForRefund,
          }

      await paymentFlowService.logPaymentFlowUpdate(
        {
          paymentFlowId: ctx.paymentFlowId,
          type: 'success',
          occurredAt: new Date(),
          paymentMethod: PaymentMethod.CARD,
          reason: 'refund_completed',
          message: 'Payment successfully refunded',
          metadata,
        },
        {
          useRetry: true,
          throwOnError: false,
        },
      )
    },
  },
})
