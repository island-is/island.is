import { Logger } from '@island.is/logging'
import { retry } from '@island.is/shared/utils/server'

import { PaymentMethod, RefundType } from '../../../types'
import { CardPaymentSuccessResponse } from '../../../types/cardPayment'
import {
  ContextWithStepResults,
  requireStepResult,
  Step,
} from '../../../utils/orchestrator'
import { PaymentFlowService } from '../../paymentFlow/paymentFlow.service'
import { RefundService } from '../../refund/refund.service'
import {
  keepDebtPayment,
  notifyPaymentCompleted,
  settleDebtStep,
} from '../cardPayment.debt'
import {
  GooglePayChargeContext,
  GooglePayPaymentContext,
  GooglePaySettlementStepResults,
} from '../cardPayment.orchestrator'
import { CardPaymentService } from '../cardPayment.service'
import { GooglePayUnsettledChargeError } from './googlePay.utils'

/** The two Google Pay sagas: the charge endpoint's and charge-verified's */
export type GooglePaySagaContext =
  | GooglePayChargeContext
  | GooglePayPaymentContext

/**
 * Best-effort refund of a charge the saga can not settle, see
 * GooglePayUnsettledChargeError, before the step's error is rethrown. The
 * step did not complete, so this is not a compensation the orchestrator runs:
 * the charge step calls it itself. A refund that goes through is reported
 * like the compensation's, and the controller answers the payer accordingly.
 * When it does not go through: a charge the gateway confirmed is CRITICAL and
 * the payer hears the refund failed; an unknown outcome most likely means
 * nothing was charged, so the refund found no payment, and it is logged for
 * reconciliation by the correlation id should one turn up.
 */
export const refundUnsettledGooglePayCharge = async ({
  ctx,
  error,
  refundService,
  paymentFlowService,
  logger,
}: {
  ctx: GooglePaySagaContext
  error: GooglePayUnsettledChargeError
  refundService: RefundService
  paymentFlowService: PaymentFlowService
  logger: Logger
}): Promise<void> => {
  const { paymentTrackingData, paymentResult } = error
  const { correlationId } = paymentTrackingData

  logger.warn(
    `[${ctx.paymentFlowId}] Refunding a Google Pay wallet transaction the saga can not settle (correlationId: ${correlationId})`,
    { outcomeKnown: paymentResult !== undefined, error: error.message },
  )

  try {
    const refund = await retry(() =>
      refundService.refundWithCorrelationId({
        paymentFlowId: ctx.paymentFlowId,
        paymentTrackingData,
      }),
    )

    await paymentFlowService.logPaymentFlowUpdate({
      paymentFlowId: ctx.paymentFlowId,
      type: 'error',
      occurredAt: new Date(),
      paymentMethod: PaymentMethod.CARD,
      reason: 'payment_failed',
      message: 'Card payment refunded: failed to complete payment processing.',
      metadata: {
        payment: paymentResult,
        refund,
        // Ties the refund to the payment, see PaymentFlowService.isCardPaymentRefunded
        correlationId,
        originalError: error.message,
        reasonForRefund: RefundType.PAYMENT_FAILURE,
      },
    })

    ctx.metadata = { ...ctx.metadata, refundSucceeded: true, refund }
  } catch (refundError) {
    if (paymentResult) {
      logger.error(
        `[${ctx.paymentFlowId}] CRITICAL: Accepted Google Pay payment but failed to refund. Manual intervention required.`,
        {
          correlationId,
          acquirerReferenceNumber: paymentResult.acquirerReferenceNumber,
          error: (refundError as Error).message,
        },
      )
      ctx.metadata = {
        ...ctx.metadata,
        refundSucceeded: false,
        refundError: (refundError as Error).message,
      }
      return
    }

    logger.error(
      `[${ctx.paymentFlowId}] Could not refund a Google Pay wallet transaction with an unknown outcome; if it charged, reconcile it manually by the correlation id`,
      {
        // Monitors count on this field, not the message text.
        googlePayOutcomeUnknown: true,
        correlationId,
        originalError: error.message,
        error: (refundError as Error).message,
      },
    )
  }
}

/**
 * The charge step's compensation once the gateway has taken the payment:
 * refund it by the saga's correlation id and tell the organisation. Leaves
 * the outcome in `ctx.metadata` for the controller and rethrows a failed
 * refund so the orchestrator logs it as CRITICAL. The caller asks
 * keepDebtPayment first.
 */
export const refundGooglePayCharge = async ({
  ctx,
  paymentResult,
  refundService,
  paymentFlowService,
  logger,
}: {
  ctx: GooglePaySagaContext
  paymentResult: CardPaymentSuccessResponse
  refundService: RefundService
  paymentFlowService: PaymentFlowService
  logger: Logger
}): Promise<void> => {
  logger.info(
    `[${ctx.paymentFlowId}] Refunding payment (correlationId: ${ctx.trackingData.correlationId})`,
  )

  try {
    const refund = await retry(() =>
      refundService.refundWithCorrelationId({
        paymentFlowId: ctx.paymentFlowId,
        paymentTrackingData: ctx.trackingData,
      }),
    )

    await paymentFlowService.logPaymentFlowUpdate({
      paymentFlowId: ctx.paymentFlowId,
      type: 'error',
      occurredAt: new Date(),
      paymentMethod: PaymentMethod.CARD,
      reason: 'payment_failed',
      message: 'Card payment refunded: failed to complete payment processing.',
      metadata: {
        payment: paymentResult,
        refund,
        // Ties the refund to this payment, see PaymentFlowService.isCardPaymentRefunded
        correlationId: ctx.trackingData.correlationId,
        originalError: ctx.error?.message,
        reasonForRefund: RefundType.PAYMENT_FAILURE,
        ...(ctx.metadata?.fjsProblem
          ? { fjsProblem: ctx.metadata.fjsProblem }
          : {}),
      },
    })

    // Store successful refund in context for error handling
    ctx.metadata = {
      ...ctx.metadata,
      refundSucceeded: true,
      refund,
    }
  } catch (refundError) {
    // Store failed refund in context for error handling
    ctx.metadata = {
      ...ctx.metadata,
      refundSucceeded: false,
      refundError: refundError.message,
    }

    // Re-throw so orchestrator logs it as CRITICAL
    throw refundError
  }
}

/**
 * The steps that follow a Google Pay charge, the same whichever saga took the
 * payment: the saga says where its payment result is. Each names the next, for
 * the branching saga; the linear one runs them in array order.
 */
export const createGooglePaySettlementSteps = <
  TContext extends GooglePaySagaContext & ContextWithStepResults<TStepResults>,
  TStepResults extends GooglePaySettlementStepResults,
>({
  cardPaymentService,
  paymentFlowService,
  logger,
  getPaymentResult,
}: {
  cardPaymentService: CardPaymentService
  paymentFlowService: PaymentFlowService
  logger: Logger
  getPaymentResult: (ctx: TContext) => CardPaymentSuccessResponse
}): {
  PERSIST_PAYMENT_CONFIRMATION: Step<
    TContext,
    TStepResults,
    'PERSIST_PAYMENT_CONFIRMATION'
  >
  SETTLE_DEBT: Step<TContext, TStepResults, 'SETTLE_DEBT'>
  NOTIFY_SUCCESSFUL_PAYMENT: Step<
    TContext,
    TStepResults,
    'NOTIFY_SUCCESSFUL_PAYMENT'
  >
} => ({
  PERSIST_PAYMENT_CONFIRMATION: {
    name: 'PERSIST_PAYMENT_CONFIRMATION',
    description: 'Persist the payment confirmation',
    execute: async (ctx) => {
      const { totalPrice } = requireStepResult(ctx, 'VALIDATE')

      await cardPaymentService.persistPaymentConfirmation({
        paymentFlowId: ctx.paymentFlowId,
        paymentResult: getPaymentResult(ctx),
        paymentTrackingData: ctx.trackingData,
        totalPrice,
      })
    },
    compensate: async (ctx) => {
      if (await keepDebtPayment({ cardPaymentService, logger, ctx })) {
        return
      }

      await paymentFlowService.deleteCardPaymentConfirmationAndFulfillment(
        ctx.paymentFlowId,
        ctx.trackingData.correlationId,
      )

      logger.info(`[${ctx.paymentFlowId}] Payment confirmation deleted`)
    },
    nextStep: 'SETTLE_DEBT',
  },
  SETTLE_DEBT: {
    name: 'SETTLE_DEBT',
    description:
      'Register the payment with FJS for debt payments, no-op for charges',
    execute: async (ctx) => {
      const { paymentFlow, totalPrice } = requireStepResult(ctx, 'VALIDATE')

      const settlement = await settleDebtStep({
        cardPaymentService,
        paymentFlow,
        paymentResult: getPaymentResult(ctx),
        trackingData: ctx.trackingData,
        totalPrice,
        onRejected: (problem) => {
          ctx.metadata = { ...ctx.metadata, fjsProblem: problem }
        },
      })

      // Both sagas declare SETTLE_DEBT as SettleDebtStepResult, see GooglePaySettlementStepResults
      return settlement as TStepResults['SETTLE_DEBT']
    },
    nextStep: 'NOTIFY_SUCCESSFUL_PAYMENT',
  },
  NOTIFY_SUCCESSFUL_PAYMENT: {
    name: 'NOTIFY_SUCCESSFUL_PAYMENT',
    description: 'Notify the successful payment',
    execute: async (ctx) => {
      const { paymentFlow } = requireStepResult(ctx, 'VALIDATE')

      await notifyPaymentCompleted({
        paymentFlowService,
        logger,
        paymentFlowId: ctx.paymentFlowId,
        paymentFlow,
        settlement: ctx.stepResults.SETTLE_DEBT,
        message: `Google Pay payment completed successfully`,
        paymentResult: getPaymentResult(ctx),
      })
    },
  },
})
