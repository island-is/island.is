import type { Logger } from '@island.is/logging'
import { DebtPaymentErrorCode } from '@island.is/shared/constants'
import type { ProblemDetailsDt } from '@island.is/clients/finance-v3'

import { PaymentMethod } from '../../types'
import type {
  CardPaymentSuccessResponse,
  PaymentTrackingData,
} from '../../types/cardPayment'
import type { DebtSettlementOutcome } from '../debtPayment/debtSettlement.service'
import type { PaymentFlowAttributes } from '../paymentFlow/models'
import type { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import type {
  ApplePayPaymentContext,
  CardPaymentContext,
} from './cardPayment.orchestrator'
import type { CardPaymentService } from './cardPayment.service'

/** Result of the SETTLE_DEBT step, `skipped` for flows that are not debt payments. */
export type SettleDebtStepResult = { type: 'skipped' } | DebtSettlementOutcome

/**
 * Whether the rollback has to leave the payment as it is: a debt payment that may be registered
 * with FJS keeps its fulfillment and is not refunded, FJS has no reversal. The PERSIST and charge
 * compensations both ask, the answer is kept in `ctx.metadata.debtPaymentKept` so they agree and
 * the controller can answer the payer that the payment went through.
 *
 * Nothing is sent to FJS before PERSIST_PAYMENT_CONFIRMATION completes, so a saga that failed
 * earlier rolls back as before. When the state can not be read the payment is kept: a refund
 * that should have happened is recoverable, the other way round is not.
 */
export const keepDebtPayment = async ({
  cardPaymentService,
  logger,
  ctx,
}: {
  cardPaymentService: CardPaymentService
  logger: Logger
  ctx: CardPaymentContext | ApplePayPaymentContext
}): Promise<boolean> => {
  if (ctx.stepResults.VALIDATE?.paymentFlow.type !== 'debt') {
    return false
  }
  if (ctx.metadata?.debtPaymentKept !== undefined) {
    return ctx.metadata.debtPaymentKept
  }
  if (!ctx.completedSteps.includes('PERSIST_PAYMENT_CONFIRMATION')) {
    return false
  }

  let keep: boolean
  try {
    const registration = await cardPaymentService.findPossibleDebtRegistration(
      ctx.paymentFlowId,
    )
    keep = registration !== null
    if (keep) {
      logger.error(
        `[${ctx.paymentFlowId}] CRITICAL: the payment saga failed after a debt payment that may be registered with FJS — it is kept paid and not refunded, reconcile manually`,
        {
          // Monitors count on this field, not the message text.
          debtRefundRefused: true,
          failedStep: ctx.failedStep,
          originalError: ctx.error?.message,
          ...registration,
        },
      )
    }
  } catch (error) {
    keep = true
    logger.error(
      `[${ctx.paymentFlowId}] CRITICAL: could not tell whether the debt payment is registered with FJS — it is kept paid and not refunded, reconcile manually`,
      {
        debtRefundRefused: true,
        failedStep: ctx.failedStep,
        originalError: ctx.error?.message,
        error: (error as Error)?.message,
      },
    )
  }

  ctx.metadata = { ...ctx.metadata, debtPaymentKept: keep }
  return keep
}

/**
 * Registers the captured payment with FJS for debt flows. A rejection throws, so that the saga
 * refunds the card, and every other outcome lets the payment complete: a deferred registration
 * is picked up by the worker.
 */
export const settleDebtStep = async ({
  cardPaymentService,
  paymentFlow,
  paymentResult,
  trackingData,
  totalPrice,
  onRejected,
}: {
  cardPaymentService: CardPaymentService
  paymentFlow: PaymentFlowAttributes
  paymentResult: CardPaymentSuccessResponse
  trackingData: PaymentTrackingData
  totalPrice: number
  onRejected: (problem?: ProblemDetailsDt) => void
}): Promise<SettleDebtStepResult> => {
  if (paymentFlow.type !== 'debt') {
    return { type: 'skipped' }
  }

  const outcome = await cardPaymentService.settleDebt({
    paymentFlow,
    paymentResult,
    trackingData,
    totalPrice,
  })

  if (outcome.type === 'rejected') {
    onRejected(outcome.problem)
    throw new Error(DebtPaymentErrorCode.DebtPaymentRejected)
  }

  return outcome
}

/**
 * Tells the organisation that the payment completed. For debt flows the money is captured and
 * possibly registered with FJS already, so a webhook that fails must not roll the payment back:
 * it is logged and skipped. Registered payments get `payment_finalized` as well.
 */
export const notifyPaymentCompleted = async ({
  paymentFlowService,
  logger,
  paymentFlowId,
  paymentFlow,
  settlement,
  message,
  paymentResult,
}: {
  paymentFlowService: PaymentFlowService
  logger: Logger
  paymentFlowId: string
  paymentFlow: PaymentFlowAttributes
  settlement: SettleDebtStepResult | undefined
  message: string
  paymentResult: CardPaymentSuccessResponse
}): Promise<void> => {
  const isDebtFlow = paymentFlow.type === 'debt'

  const notify = async () => {
    await paymentFlowService.logPaymentFlowUpdate(
      {
        paymentFlowId,
        type: 'success',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'payment_completed',
        message,
        metadata: {
          payment: paymentResult,
        },
      },
      {
        useRetry: true,
        throwOnError: !isDebtFlow,
      },
    )

    if (settlement?.type === 'registered' && !settlement.alreadySettled) {
      await paymentFlowService.logPaymentFlowUpdate(
        {
          paymentFlowId,
          type: 'update',
          occurredAt: new Date(),
          paymentMethod: PaymentMethod.CARD,
          reason: 'payment_finalized',
          message: 'Debt payment registered with FJS',
          metadata: {
            dateCreated: settlement.dateCreated,
          },
        },
        { useRetry: true, throwOnError: false },
      )
    }
  }

  if (!isDebtFlow) {
    await notify()
    return
  }

  try {
    await notify()
  } catch (error) {
    logger.error(
      `[${paymentFlowId}] Failed to notify upstream of a completed debt payment`,
      { error: (error as Error)?.message },
    )
  }
}
