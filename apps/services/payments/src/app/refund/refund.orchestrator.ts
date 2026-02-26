import { InferAttributes } from 'sequelize'

import { Logger } from '@island.is/logging'

import { RefundSuccessResponse } from '../../types/cardPayment'
import { PaymentMethod } from '../../types/payment'
import {
  ContextWithStepResults,
  Orchestrator,
  SagaDefinition,
} from '../../utils/orchestrator'
import { CardPaymentDetails } from '../paymentFlow/models/cardPaymentDetails.model'
import { PaymentFulfillment } from '../paymentFlow/models/paymentFulfillment.model'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import { RefundPaymentInput } from './dtos'

export interface PaymentContext<TStepResults extends object>
  extends ContextWithStepResults<TStepResults> {
  paymentFlowId: string
  paymentMethod: PaymentMethod
}

export class PaymentOrchestrator<
  TContext extends PaymentContext<TStepResults>,
  TStepResults extends object = Record<string, unknown>,
> {
  private orchestrator: Orchestrator<TContext, TStepResults>
  private paymentFlowService: PaymentFlowService

  constructor(logger: Logger, paymentFlowService: PaymentFlowService) {
    this.paymentFlowService = paymentFlowService
    this.orchestrator = new Orchestrator({
      logger,
      logContext: (ctx) => `[${ctx.paymentFlowId}]`,
      stepTimeoutMs: 60_000,
      onRollbackFailure: async (step, error, context, executionHistory) => {
        await this.paymentFlowService.logPaymentFlowUpdate({
          paymentFlowId: context.paymentFlowId,
          type: 'error',
          occurredAt: new Date(),
          paymentMethod: context.paymentMethod,
          reason: 'other',
          message: `CRITICAL: Failed to rollback step ${step.name}: ${error.message}`,
          metadata: {
            failedStep: step.name,
            rollbackError: error.message,
            originalError: context.error?.message,
            executionHistory: executionHistory.map((e) => ({
              type: e.type,
              step: e.step,
              timestamp: e.timestamp,
            })),
          },
        })
      },
    })
  }

  async execute(
    saga: SagaDefinition<TContext, TStepResults>,
    context: TContext,
    startStep?: string,
  ) {
    return this.orchestrator.execute(saga, context, startStep)
  }
}

// Card refund types
export type CardRefundSagaDefinition = SagaDefinition<
  CardRefundContext,
  CardRefundStepResults
>

export interface CardRefundStepResults {
  VALIDATE_REFUND: {
    cardPaymentConfirmation: InferAttributes<CardPaymentDetails>
    hasFjsCharge: boolean
  }
  DELETE_FJS_CHARGE: { action: 'deleted_fjs' }
  REFUND_PAYMENT: { action: 'refunded'; refundResult: RefundSuccessResponse }
  DELETE_CARD_PAYMENT_CONFIRMATION: {
    deletedPaymentConfirmation: InferAttributes<CardPaymentDetails> | null
    deletedPaymentFulfillment: InferAttributes<PaymentFulfillment> | null
  }
  LOG_REFUND_SUCCESS: void
}

export interface CardRefundContext
  extends PaymentContext<CardRefundStepResults> {
  input: RefundPaymentInput
  paymentFulfillment: InferAttributes<PaymentFulfillment>
}

// Invoice refund types
export type InvoiceRefundSagaDefinition = SagaDefinition<
  InvoiceRefundContext,
  InvoiceRefundStepResults
>

export interface InvoiceRefundStepResults {
  DELETE_INVOICE_FULFILLMENT: {
    deletedPaymentFulfillment: InferAttributes<PaymentFulfillment>
  }
  DELETE_FJS_CHARGE: { action: 'deleted_fjs' }
  LOG_REFUND_SUCCESS: void
}

export interface InvoiceRefundContext
  extends PaymentContext<InvoiceRefundStepResults> {
  input: RefundPaymentInput
  paymentFulfillment: InferAttributes<PaymentFulfillment>
}
