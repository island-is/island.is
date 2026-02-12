import { uuid } from 'uuidv4'

import { Logger } from '@island.is/logging'
import { retry } from '@island.is/shared/utils/server'

import { PaymentMethod, RefundType } from '../../types'
import { requireStepResult } from '../../utils/orchestrator'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import {
  CardPaymentContext,
  CardPaymentSagaDefinition,
} from './cardPayment.orchestrator'
import { CardPaymentService } from './cardPayment.service'
import { ChargeCardInput } from './dtos'

export const createCardPaymentContext = (
  paymentFlowId: string,
  input: ChargeCardInput,
): CardPaymentContext => {
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

export const createCardPaymentSaga = (
  cardPaymentService: CardPaymentService,
  paymentFlowService: PaymentFlowService,
  logger: Logger,
): CardPaymentSagaDefinition => [
  {
    name: 'VALIDATE',
    description: 'Validate the payment flow exists and is eligible to be paid',
    execute: async (ctx) => {
      return await cardPaymentService.validatePaymentFlow(ctx.paymentFlowId)
    },
  },
  {
    name: 'CHARGE_CARD',
    description: 'Charge the card',
    execute: async (ctx) => {
      logger.info(
        `[${ctx.paymentFlowId}][CARD_PAYMENT] Starting payment with correlation id ${ctx.trackingData.correlationId}`,
      )
      const { totalPrice } = requireStepResult(ctx, 'VALIDATE')

      const paymentResult = await cardPaymentService.charge({
        chargeCardInput: ctx.input,
        paymentTrackingData: ctx.trackingData,
        amount: totalPrice,
      })

      return { paymentResult }
    },
    compensate: async (ctx) => {
      const { paymentResult } = requireStepResult(ctx, 'CHARGE_CARD')
      const { totalPrice } = requireStepResult(ctx, 'VALIDATE')

      logger.info(
        `[${ctx.paymentFlowId}][CARD_PAYMENT] Attempting to refund payment with correlation id ${ctx.trackingData.correlationId}`,
      )

      try {
        const refund = await retry(() =>
          cardPaymentService.refund({
            paymentFlowId: ctx.paymentFlowId,
            cardNumber: ctx.input.cardNumber,
            acquirerReferenceNumber: paymentResult.acquirerReferenceNumber,
            amount: totalPrice,
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
      'CRITICAL: Accepted payment but failed to refund. Manual intervention required.',
  },
  {
    name: 'PERSIST_PAYMENT_CONFIRMATION',
    description: 'Persist the payment confirmation',
    execute: async (ctx) => {
      const { paymentResult } = requireStepResult(ctx, 'CHARGE_CARD')
      const { totalPrice } = requireStepResult(ctx, 'VALIDATE')

      await cardPaymentService.persistPaymentConfirmation({
        paymentFlowId: ctx.paymentFlowId,
        paymentResult: paymentResult,
        paymentTrackingData: ctx.trackingData,
        totalPrice,
      })
    },
    compensate: async (ctx) => {
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
    },
  },
  {
    name: 'NOTIFY_SUCCESSFUL_PAYMENT',
    description: 'Notify the successful payment',
    execute: async (ctx) => {
      const { paymentResult } = requireStepResult(ctx, 'CHARGE_CARD')

      await paymentFlowService.logPaymentFlowUpdate(
        {
          paymentFlowId: ctx.paymentFlowId,
          type: 'success',
          occurredAt: new Date(),
          paymentMethod: PaymentMethod.CARD,
          reason: 'payment_completed',
          message: `Card payment completed successfully`,
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
