import { uuid } from 'uuidv4'

import { Logger } from '@island.is/logging'
import { PaymentMethod } from '../../../types'
import { requireStepResult } from '../../../utils/orchestrator'
import { PaymentFlowService } from '../../paymentFlow/paymentFlow.service'
import { RefundService } from '../../refund/refund.service'
import {
  GooglePayPaymentContext,
  GooglePayPaymentSagaDefinition,
  GooglePayPaymentStepResults,
} from '../cardPayment.orchestrator'
import { CardPaymentService } from '../cardPayment.service'
import { keepDebtPayment } from '../cardPayment.debt'
import { GooglePayChargeVerifiedInput } from './dtos'
import { GooglePayUnsettledChargeError } from './googlePay.utils'
import {
  createGooglePaySettlementSteps,
  refundGooglePayCharge,
  refundUnsettledGooglePayCharge,
} from './googlePaySaga.shared'

export const createGooglePayPaymentContext = (
  paymentFlowId: string,
  input: GooglePayChargeVerifiedInput,
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

/**
 * The charge-verified endpoint's saga: a card saved in the Google account
 * (PAN_ONLY) that has passed the 3-D Secure the charge endpoint started is
 * charged like a typed card.
 */
export const createGooglePayPaymentSaga = (
  cardPaymentService: CardPaymentService,
  refundService: RefundService,
  paymentFlowService: PaymentFlowService,
  logger: Logger,
): GooglePayPaymentSagaDefinition => {
  const settlement = createGooglePaySettlementSteps<
    GooglePayPaymentContext,
    GooglePayPaymentStepResults
  >({
    cardPaymentService,
    paymentFlowService,
    logger,
    getPaymentResult: (ctx) =>
      requireStepResult(ctx, 'CHARGE_GOOGLE_PAY').paymentResult,
  })

  return [
    {
      name: 'VALIDATE',
      description:
        'Validate the payment flow exists and is eligible to be paid',
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

        try {
          const paymentResult = await cardPaymentService.chargeGooglePay({
            paymentFlowId: ctx.paymentFlowId,
            token: ctx.input.token,
            paymentTrackingData: ctx.trackingData,
            amount: totalPrice,
          })

          return { paymentResult }
        } catch (error) {
          // The step did not complete, so its compensation will not run: a
          // charge the second decryption may have taken is refunded here
          if (error instanceof GooglePayUnsettledChargeError) {
            await refundUnsettledGooglePayCharge({
              ctx,
              error,
              refundService,
              paymentFlowService,
              logger,
            })
          }
          throw error
        }
      },
      compensate: async (ctx) => {
        if (await keepDebtPayment({ cardPaymentService, logger, ctx })) {
          return
        }

        const { paymentResult } = requireStepResult(ctx, 'CHARGE_GOOGLE_PAY')

        await refundGooglePayCharge({
          ctx,
          paymentResult,
          refundService,
          paymentFlowService,
          logger,
        })
      },
      rollbackFailureMessage:
        'CRITICAL: Accepted Google Pay payment but failed to refund. Manual intervention required.',
    },
    settlement.PERSIST_PAYMENT_CONFIRMATION,
    settlement.SETTLE_DEBT,
    settlement.NOTIFY_SUCCESSFUL_PAYMENT,
  ]
}
