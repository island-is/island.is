import { uuid } from 'uuidv4'

import { Logger } from '@island.is/logging'
import { retry } from '@island.is/shared/utils/server'
import { PaymentMethod, RefundType } from '../../types'
import { requireStepResult } from '../../utils/orchestrator'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import {
  ApplePayPaymentContext,
  ApplePayPaymentSagaDefinition,
} from './cardPayment.orchestrator'
import { CardPaymentService } from './cardPayment.service'
import { ApplePayChargeInput } from './dtos'

export const createApplePayPaymentContext = (
  paymentFlowId: string,
  input: ApplePayChargeInput,
): ApplePayPaymentContext => {
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

export const createApplePayPaymentSaga = (
  cardPaymentService: CardPaymentService,
  paymentFlowService: PaymentFlowService,
  logger: Logger,
): ApplePayPaymentSagaDefinition => [
  {
    name: 'VALIDATE',
    description: 'Validate the payment flow exists and is eligible to be paid',
    execute: async (ctx) => {
      return await cardPaymentService.validatePaymentFlow(ctx.paymentFlowId)
    },
  },
  {
    name: 'CHARGE_APPLE_PAY',
    description: 'Charge via Apple Pay',
    execute: async (ctx) => {
      logger.info(
        `[${ctx.paymentFlowId}][APPLE_PAY] Starting payment with correlation id ${ctx.trackingData.correlationId}`,
      )

      await paymentFlowService.logPaymentFlowUpdate({
        paymentFlowId: ctx.paymentFlowId,
        type: 'update',
        occurredAt: new Date(),
        paymentMethod: PaymentMethod.CARD,
        reason: 'payment_started',
        message: `Apple Pay payment started`,
        metadata: {
          correlationId: ctx.trackingData.correlationId,
        },
      })

      const paymentResult = await cardPaymentService.chargeApplePay(
        ctx.input,
        ctx.trackingData,
      )

      return { paymentResult }
    },
    compensate: async (ctx) => {
      const { paymentResult } = requireStepResult(ctx, 'CHARGE_APPLE_PAY')

      logger.info(
        `[${ctx.paymentFlowId}][APPLE_PAY] Attempting to refund payment with correlation id ${ctx.trackingData.correlationId}`,
      )

      try {
        const refund = await retry(() =>
          cardPaymentService.refundWithCorrelationId({
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
            originalError: ctx.error?.message,
            reasonForRefund: RefundType.PAYMENT_FAILURE,
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
      'CRITICAL: Accepted Apple Pay payment but failed to refund. Manual intervention required.',
  },
  {
    name: 'PERSIST_PAYMENT_CONFIRMATION',
    description: 'Persist the payment confirmation',
    execute: async (ctx) => {
      const { paymentResult } = requireStepResult(ctx, 'CHARGE_APPLE_PAY')
      const { totalPrice } = requireStepResult(ctx, 'VALIDATE')

      await cardPaymentService.persistPaymentConfirmation({
        paymentFlowId: ctx.paymentFlowId,
        paymentResult: paymentResult,
        paymentTrackingData: ctx.trackingData,
        totalPrice,
      })
    },
    compensate: async (ctx) => {
      logger.info(
        `[${ctx.paymentFlowId}][APPLE_PAY] Attempting to delete payment confirmation with correlation id ${ctx.trackingData.correlationId}`,
      )

      const deletedPaymentConfirmation =
        await paymentFlowService.deleteCardPaymentConfirmation(
          ctx.paymentFlowId,
          ctx.trackingData.correlationId,
        )

      if (!deletedPaymentConfirmation) {
        throw new Error('Failed to delete payment confirmation during rollback')
      }

      const deletedPaymentFulfillment =
        await paymentFlowService.deletePaymentFulfillment({
          paymentFlowId: ctx.paymentFlowId,
          confirmationRefId: deletedPaymentConfirmation.id,
          correlationId: ctx.trackingData.correlationId,
        })

      if (!deletedPaymentFulfillment) {
        throw new Error('Failed to delete payment fulfillment during rollback')
      }

      logger.info(
        `[${ctx.paymentFlowId}][APPLE_PAY] Successfully deleted payment confirmation`,
      )
    },
  },
  {
    name: 'NOTIFY_SUCCESSFUL_PAYMENT',
    description: 'Notify the successful payment',
    execute: async (ctx) => {
      const { paymentResult } = requireStepResult(ctx, 'CHARGE_APPLE_PAY')

      await paymentFlowService.logPaymentFlowUpdate(
        {
          paymentFlowId: ctx.paymentFlowId,
          type: 'success',
          occurredAt: new Date(),
          paymentMethod: PaymentMethod.CARD,
          reason: 'payment_completed',
          message: `Apple Pay payment completed successfully`,
          metadata: {
            payment: paymentResult,
          },
        },
        {
          useRetry: true,
          throwOnError: true,
        },
      )
    },
  },
]
