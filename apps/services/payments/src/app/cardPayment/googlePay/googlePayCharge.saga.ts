import { uuid } from 'uuidv4'

import { Logger } from '@island.is/logging'
import { PaymentMethod } from '../../../types'
import { requireStepResult } from '../../../utils/orchestrator'
import { PaymentFlowService } from '../../paymentFlow/paymentFlow.service'
import { RefundService } from '../../refund/refund.service'
import {
  GooglePayChargeContext,
  GooglePayChargeSagaDefinition,
  GooglePayChargeStepResults,
} from '../cardPayment.orchestrator'
import { CardPaymentService } from '../cardPayment.service'
import { keepDebtPayment } from '../cardPayment.debt'
import { GooglePayChargeInput } from './dtos'
import { GooglePayUnsettledChargeError } from './googlePay.utils'
import {
  createGooglePaySettlementSteps,
  refundGooglePayCharge,
  refundUnsettledGooglePayCharge,
} from './googlePaySaga.shared'

export const createGooglePayChargeContext = (
  paymentFlowId: string,
  input: GooglePayChargeInput,
): GooglePayChargeContext => {
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

/** The payment the saga took, once DECRYPT_GOOGLE_PAY_TOKEN charged the token */
export const chargedGooglePayPaymentResult = (ctx: GooglePayChargeContext) => {
  const decryption = requireStepResult(ctx, 'DECRYPT_GOOGLE_PAY_TOKEN')
  if (decryption.outcome !== 'charged') {
    throw new Error('The Google Pay token was decrypted, not charged')
  }
  return decryption.paymentResult
}

/**
 * The charge endpoint's saga. It branches on what the gateway does with the
 * token: a card saved in the Google account (PAN_ONLY) comes back decrypted
 * and is sent to 3-D Secure, to be charged through charge-verified; a device
 * token (CRYPTOGRAM_3DS) is charged by the gateway outright, and the saga
 * settles that payment like the other card sagas do. Starts at VALIDATE.
 */
export const createGooglePayChargeSaga = (
  cardPaymentService: CardPaymentService,
  refundService: RefundService,
  paymentFlowService: PaymentFlowService,
  logger: Logger,
): GooglePayChargeSagaDefinition => ({
  VALIDATE: {
    name: 'VALIDATE',
    description: 'Validate the payment flow exists and is eligible to be paid',
    execute: async (ctx) => {
      return await cardPaymentService.validatePaymentFlow(ctx.paymentFlowId)
    },
    nextStep: 'DECRYPT_GOOGLE_PAY_TOKEN',
  },
  DECRYPT_GOOGLE_PAY_TOKEN: {
    name: 'DECRYPT_GOOGLE_PAY_TOKEN',
    description:
      'Have the gateway decrypt the Google Pay token, or charge it when it is a device token',
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
        `[${ctx.paymentFlowId}][correlationId: ${ctx.trackingData.correlationId}][rrn: ${ctx.trackingData.merchantReferenceData}] Sending the Google Pay token to the gateway`,
      )

      try {
        return await cardPaymentService.decryptOrChargeGooglePayToken({
          paymentFlowId: ctx.paymentFlowId,
          token: ctx.input.token,
          paymentTrackingData: ctx.trackingData,
          amount: totalPrice,
        })
      } catch (error) {
        // The step did not complete, so its compensation will not run: a
        // charge the gateway may have taken is refunded here
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
      const decryption = requireStepResult(ctx, 'DECRYPT_GOOGLE_PAY_TOKEN')
      // Nothing was charged: the token is released already
      if (decryption.outcome !== 'charged') {
        return
      }
      if (await keepDebtPayment({ cardPaymentService, logger, ctx })) {
        return
      }

      await refundGooglePayCharge({
        ctx,
        paymentResult: decryption.paymentResult,
        refundService,
        paymentFlowService,
        logger,
      })
    },
    rollbackFailureMessage:
      'CRITICAL: Accepted Google Pay payment but failed to refund. Manual intervention required.',
    nextStep: (ctx) =>
      requireStepResult(ctx, 'DECRYPT_GOOGLE_PAY_TOKEN').outcome === 'charged'
        ? 'PERSIST_PAYMENT_CONFIRMATION'
        : 'START_VERIFICATION',
  },
  START_VERIFICATION: {
    name: 'START_VERIFICATION',
    description: 'Start 3-D Secure for the decrypted card',
    execute: async (ctx) => {
      const { totalPrice } = requireStepResult(ctx, 'VALIDATE')
      const decryption = requireStepResult(ctx, 'DECRYPT_GOOGLE_PAY_TOKEN')
      if (decryption.outcome !== 'card') {
        throw new Error('The Google Pay token was charged, not decrypted')
      }

      const verification = await cardPaymentService.verifyGooglePaySavedCard({
        input: ctx.input,
        card: decryption.card,
        totalPrice,
      })

      return { verification }
    },
    // The saga ends here: the payment is taken through charge-verified once
    // the card has passed 3-D Secure
    nextStep: null,
  },
  ...createGooglePaySettlementSteps<
    GooglePayChargeContext,
    GooglePayChargeStepResults
  >({
    cardPaymentService,
    paymentFlowService,
    logger,
    getPaymentResult: chargedGooglePayPaymentResult,
  }),
})
