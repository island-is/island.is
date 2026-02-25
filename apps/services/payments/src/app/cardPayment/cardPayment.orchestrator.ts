import {
  CardPaymentSuccessResponse,
  PaymentTrackingData,
} from '../../types/cardPayment'
import { CatalogItemWithQuantity } from '../../types/charges'
import { SagaDefinition } from '../../utils/orchestrator'
import { PaymentFlowAttributes } from '../paymentFlow/models/paymentFlow.model'
import { PaymentContext } from '../refund/refund.orchestrator'
import { ApplePayChargeInput, ChargeCardInput } from './dtos'

export { PaymentOrchestrator, PaymentContext } from '../refund/refund.orchestrator'

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
