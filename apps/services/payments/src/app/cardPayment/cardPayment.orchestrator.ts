import type { ProblemDetailsDt } from '@island.is/clients/finance-v3'

import {
  CardPaymentSuccessResponse,
  PaymentTrackingData,
  RefundSuccessResponse,
} from '../../types/cardPayment'
import { CatalogItemWithQuantity } from '../../types/charges'
import { SagaDefinition } from '../../utils/orchestrator'
import { PaymentFlowAttributes } from '../paymentFlow/models'
import { PaymentContext } from '../refund/refund.orchestrator'
import type { SettleDebtStepResult } from './cardPayment.debt'
import { ApplePayChargeInput } from './applePay/dtos'
import { ChargeCardInput } from './card/dtos'
import type { GooglePayDecryptedToken } from './googlePay/googlePayToken'

export {
  PaymentOrchestrator,
  PaymentContext,
} from '../refund/refund.orchestrator'

/** What the sagas leave in `ctx.metadata` for the compensations and the controller. */
export type CardPaymentSagaMetadata = {
  /** Set by the charge compensation: whether the card was refunded */
  refundSucceeded?: boolean
  refund?: RefundSuccessResponse
  refundError?: string
  /** FJS's answer when it rejected the debt payment, goes into the payment_failed event */
  fjsProblem?: ProblemDetailsDt
  /** The rollback left a debt payment that may be registered with FJS alone, see keepDebtPayment */
  debtPaymentKept?: boolean
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
  SETTLE_DEBT: SettleDebtStepResult
  NOTIFY_SUCCESSFUL_PAYMENT: void
}

export interface CardPaymentContext
  extends PaymentContext<CardPaymentStepResults> {
  input: ChargeCardInput
  trackingData: PaymentTrackingData
  metadata?: CardPaymentSagaMetadata
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
  SETTLE_DEBT: SettleDebtStepResult
  NOTIFY_SUCCESSFUL_PAYMENT: void
}

export interface ApplePayPaymentContext
  extends PaymentContext<ApplePayPaymentStepResults> {
  input: ApplePayChargeInput
  trackingData: PaymentTrackingData
  metadata?: CardPaymentSagaMetadata
}

// Google Pay payment types
export type GooglePayPaymentSagaDefinition = SagaDefinition<
  GooglePayPaymentContext,
  GooglePayPaymentStepResults
>

export interface GooglePayPaymentStepResults {
  VALIDATE: {
    paymentFlow: PaymentFlowAttributes
    catalogItems: CatalogItemWithQuantity[]
    totalPrice: number
  }
  CHARGE_GOOGLE_PAY: {
    paymentResult: CardPaymentSuccessResponse
  }
  PERSIST_PAYMENT_CONFIRMATION: void
  SETTLE_DEBT: SettleDebtStepResult
  NOTIFY_SUCCESSFUL_PAYMENT: void
}

export interface GooglePayPaymentContext
  extends PaymentContext<GooglePayPaymentStepResults> {
  /** Decrypted by the controller, which picks the path by authMethod */
  input: GooglePayDecryptedToken
  trackingData: PaymentTrackingData
  metadata?: CardPaymentSagaMetadata
}
