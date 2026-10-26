import { uuid } from 'uuidv4'

import { Logger } from '@island.is/logging'
import { retry } from '@island.is/shared/utils/server'
import { PaymentMethod, RefundType } from '../../../types'
import { requireStepResult } from '../../../utils/orchestrator'
import { PaymentFlowService } from '../../paymentFlow/paymentFlow.service'
import { RefundService } from '../../refund/refund.service'
import {
  GooglePayPaymentContext,
  GooglePayPaymentSagaDefinition,
} from '../cardPayment.orchestrator'
import { CardPaymentService } from '../cardPayment.service'
import {
  keepDebtPayment,
  notifyPaymentCompleted,
  settleDebtStep,
} from '../cardPayment.debt'
import { GooglePayDecryptedToken } from './googlePayToken'

export const createGooglePayPaymentContext = (
  paymentFlowId: string,
  input: GooglePayDecryptedToken,
): GooglePayPaymentContext => {
  const trackingData = {
    merchantReferenceData: uuid(),
    correlationId: uuid(),
    paymentDate: new Date(),
  }

  return {
    paymentFlowId,
    paymentMethod: PaymentMethod.CARD,
    input,
    trackingData,

    stepResults: {},
    completedSteps: [],
    startTime: new Date(),
  }
}

export const createGooglePayPaymentSaga = (
  cardPaymentService: CardPaymentService,
  refundService: RefundService,
  paymentFlowService: PaymentFlowService,
  logger: Logger,
): GooglePayPaymentSagaDefinition => [
  {
    name: 'VALIDATE',
    description: 'Validate the payment flow exists and is eligible to be paid',
    execute: async (ctx) => {
      return await cardPaymentService.validatePaymentFlow(ctx.paymentFlowId)
    },
  },
  {
    name: 'CHARGE_GOOGLE_PAY',
    description: 'Charge via Google Pay',
    execute: async (ctx) => {
      await paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId: ctx.paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'payment_started',
        message: `Google Pay payment started`,
        metadata: {
          correlationId: ctx.trackingData.correlationId,
        },
      })

      const { totalPrice } = requireStepResult(ctx, 'VALIDATE')

      logger.info(
        `[${ctx.paymentFlowId}][correlationId: ${ctx.trackingData.correlationId}][rrn: ${ctx.trackingData.merchantReferenceData}] Charging Google Pay`,
      )

      const paymentResult = await cardPaymentService.chargeGooglePay({
        paymentFlowId: ctx.paymentFlowId,
        decryptedToken: ctx.input,
        paymentTrackingData: ctx.trackingData,
        amount: totalPrice,
      })

      return { paymentResult }
    },
    compensate: async (ctx) => {
      if (await keepDebtPayment({ cardPaymentService, logger, ctx })) {
        return
      }

      const { paymentResult } = requireStepResult(ctx, 'CHARGE_GOOGLE_PAY')

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
          message:
            'Card payment refunded: failed to complete payment processing.',
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
    },
    rollbackFailureMessage:
      'CRITICAL: Accepted Google Pay payment but failed to refund. Manual intervention required.',
  },
  {
    name: 'PERSIST_PAYMENT_CONFIRMATION',
    description: 'Persist the payment confirmation',
    execute: async (ctx) => {
      const { paymentResult } = requireStepResult(ctx, 'CHARGE_GOOGLE_PAY')
      const { totalPrice } = requireStepResult(ctx, 'VALIDATE')

      await cardPaymentService.persistPaymentConfirmation({
        paymentFlowId: ctx.paymentFlowId,
        paymentResult: paymentResult,
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
  },
  {
    name: 'SETTLE_DEBT',
    description:
      'Register the payment with FJS for debt payments, no-op for charges',
    execute: async (ctx) => {
      const { paymentFlow, totalPrice } = requireStepResult(ctx, 'VALIDATE')
      const { paymentResult } = requireStepResult(ctx, 'CHARGE_GOOGLE_PAY')

      return await settleDebtStep({
        cardPaymentService,
        paymentFlow,
        paymentResult,
        trackingData: ctx.trackingData,
        totalPrice,
        onRejected: (problem) => {
          ctx.metadata = { ...ctx.metadata, fjsProblem: problem }
        },
      })
    },
  },
  {
    name: 'NOTIFY_SUCCESSFUL_PAYMENT',
    description: 'Notify the successful payment',
    execute: async (ctx) => {
      const { paymentFlow } = requireStepResult(ctx, 'VALIDATE')
      const { paymentResult } = requireStepResult(ctx, 'CHARGE_GOOGLE_PAY')

      await notifyPaymentCompleted({
        paymentFlowService,
        logger,
        paymentFlowId: ctx.paymentFlowId,
        paymentFlow,
        settlement: ctx.stepResults.SETTLE_DEBT,
        message: `Google Pay payment completed successfully`,
        paymentResult,
      })
    },
  },
]
