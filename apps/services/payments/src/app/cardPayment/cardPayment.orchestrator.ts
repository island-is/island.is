import { InferAttributes } from 'sequelize'

import { Logger } from '@island.is/logging'

import {
  CardPaymentSuccessResponse,
  PaymentTrackingData,
  RefundSuccessResponse,
} from '../../types/cardPayment'
import { CatalogItemWithQuantity } from '../../types/charges'
import { PaymentMethod } from '../../types/payment'
import {
  ContextWithStepResults,
  Orchestrator,
  SagaDefinition,
} from '../../utils/orchestrator'
import { CardPaymentDetails } from '../paymentFlow/models/cardPaymentDetails.model'
import { PaymentFlowAttributes } from '../paymentFlow/models/paymentFlow.model'
import { PaymentFlowService } from '../paymentFlow/paymentFlow.service'
import {
  ApplePayChargeInput,
  ChargeCardInput,
  RefundCardPaymentInput,
} from './dtos'

// Generic context that all card payment contexts must extend
export interface PaymentContext<TStepResults extends object>
  extends ContextWithStepResults<TStepResults> {
  paymentFlowId: string
  paymentMethod: PaymentMethod
}

// Generic Payment Orchestrator that can be used for card payments
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
      onRollbackFailure: async (step, error, context, executionHistory) => {
        // Log critical rollback failure to payment flow service
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

// Card payment types
export type CardPaymentSagaDefinition = SagaDefinition<
  CardPaymentContext,
  CardPaymentStepResults
>

export interface CardPaymentStepResults {
  VALIDATE: {
    paymentFlow: PaymentFlowAttributes
    catalogItems: CatalogItemWithQuantity[]
    totalPrice: number
  }
  CHARGE_CARD: {
    paymentResult: CardPaymentSuccessResponse
  }
  PERSIST_PAYMENT_CONFIRMATION: void
  NOTIFY_SUCCESSFUL_PAYMENT: void
}

export interface CardPaymentContext
  extends PaymentContext<CardPaymentStepResults> {
  input: ChargeCardInput
  trackingData: PaymentTrackingData
}

// Apple pay payment types
export type ApplePayPaymentSagaDefinition = SagaDefinition<
  ApplePayPaymentContext,
  ApplePayPaymentStepResults
>

export interface ApplePayPaymentStepResults {
  VALIDATE: {
    paymentFlow: PaymentFlowAttributes
    catalogItems: CatalogItemWithQuantity[]
    totalPrice: number
  }
  CHARGE_APPLE_PAY: {
    paymentResult: CardPaymentSuccessResponse
  }
  PERSIST_PAYMENT_CONFIRMATION: void
  NOTIFY_SUCCESSFUL_PAYMENT: void
}

export interface ApplePayPaymentContext
  extends PaymentContext<ApplePayPaymentStepResults> {
  input: ApplePayChargeInput
  trackingData: PaymentTrackingData
}

// Refund types
export type RefundSagaDefinition = SagaDefinition<
  RefundContext,
  RefundStepResults
>

export interface RefundStepResults {
  VALIDATE_REFUND: {
    paymentFulfillment: {
      id: string
      paymentFlowId: string
      confirmationRefId: string
      fjsChargeId?: string | null
    }
    cardPaymentConfirmation: InferAttributes<CardPaymentDetails>
    hasFjsCharge: boolean
  }
  DELETE_FJS_CHARGE: { action: 'deleted_fjs' }
  REFUND_PAYMENT: { action: 'refunded'; refundResult: RefundSuccessResponse }
  DELETE_CARD_PAYMENT_CONFIRMATION: void
  LOG_REFUND_SUCCESS: void
}

export interface RefundContext extends PaymentContext<RefundStepResults> {
  input: RefundCardPaymentInput
}
