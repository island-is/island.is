import { BadRequestException } from '@nestjs/common'

import type { Logger } from '@island.is/logging'
import { retry } from '@island.is/shared/utils/server'

import { PaymentMethod, PaymentTrackingData, RefundType } from '../../types'
import type { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import type { RefundService } from '../refund/refund.service'
import type { CardPaymentSagaMetadata } from './cardPayment.orchestrator'

/**
 * The gateway approved the transaction (isSuccess) but the answer lacks a
 * field the service requires, see the schemas in types/cardPayment. For a
 * charge the money has moved: the charge step refunds it by its correlation
 * id, see refundApprovedUnreadableCharge. Still a BadRequestException with the
 * message an unreadable answer always had, so the endpoints answer as before.
 */
export class GatewayApprovedUnreadableError extends BadRequestException {
  constructor(public readonly responseFields: string[]) {
    super('Failed to parse payment gateway response')
    this.name = 'GatewayApprovedUnreadableError'
    Object.setPrototypeOf(this, GatewayApprovedUnreadableError.prototype)
  }
}

/**
 * Refund of a charge the gateway approved but the service could not read, by
 * the saga's correlation id, as the answer may lack what the payment result's
 * refund needs. The charge step did not complete, so this is not a
 * compensation the orchestrator runs: the step calls it before rethrowing.
 * Leaves the outcome in `ctx.metadata` for the controller, like the charge
 * compensation; a refund that fails is logged CRITICAL for reconciliation.
 */
export const refundApprovedUnreadableCharge = async ({
  ctx,
  error,
  refundService,
  paymentFlowService,
  logger,
}: {
  ctx: {
    paymentFlowId: string
    trackingData: PaymentTrackingData
    metadata?: CardPaymentSagaMetadata
  }
  error: GatewayApprovedUnreadableError
  refundService: RefundService
  paymentFlowService: PaymentFlowService
  logger: Logger
}): Promise<void> => {
  const { correlationId } = ctx.trackingData

  logger.warn(
    `[${ctx.paymentFlowId}] Refunding a charge the gateway approved but the service could not read (correlationId: ${correlationId})`,
    { responseFields: error.responseFields },
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
        refund,
        // Ties the refund to this payment, see PaymentFlowService.isCardPaymentRefunded
        correlationId,
        originalError: error.message,
        reasonForRefund: RefundType.PAYMENT_FAILURE,
      },
    })

    ctx.metadata = { ...ctx.metadata, refundSucceeded: true, refund }
  } catch (refundError) {
    logger.error(
      `[${ctx.paymentFlowId}] CRITICAL: The gateway approved a charge the service could not read and the refund failed. Manual intervention required.`,
      {
        correlationId,
        responseFields: error.responseFields,
        error: (refundError as Error).message,
      },
    )

    ctx.metadata = {
      ...ctx.metadata,
      refundSucceeded: false,
      refundError: (refundError as Error).message,
    }
  }
}
