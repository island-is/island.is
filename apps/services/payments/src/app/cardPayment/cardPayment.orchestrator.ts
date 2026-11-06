import type { ProblemDetailsDt } from '@island.is/clients/finance-v3'

import {
  CardPaymentSuccessResponse,
  CardVerificationSuccessResponse,
  GooglePayWalletTransactionOutcome,
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
import {
  GooglePayChargeInput,
  GooglePayChargeVerifiedInput,
} from './googlePay/dtos'

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

// Google Pay types: two sagas, one for each endpoint

/** The steps after a charge, the same in both Google Pay sagas, see googlePaySaga.shared */
export interface GooglePaySettlementStepResults {
  VALIDATE: {
    paymentFlow: PaymentFlowAttributes
    catalogItems: CatalogItemWithQuantity[]
    totalPrice: number
  }
  PERSIST_PAYMENT_CONFIRMATION: void
  SETTLE_DEBT: SettleDebtStepResult
  NOTIFY_SUCCESSFUL_PAYMENT: void
}

/**
 * The charge endpoint: the gateway either decrypts the token, and its card is
 * sent to 3-D Secure, or charges it, and the payment is settled.
 */
export type GooglePayChargeSagaDefinition = SagaDefinition<
  GooglePayChargeContext,
  GooglePayChargeStepResults
>

export interface GooglePayChargeStepResults
  extends GooglePaySettlementStepResults {
  DECRYPT_GOOGLE_PAY_TOKEN: GooglePayWalletTransactionOutcome
  START_VERIFICATION: {
    verification: CardVerificationSuccessResponse
  }
}

export interface GooglePayChargeContext
  extends PaymentContext<GooglePayChargeStepResults> {
  input: GooglePayChargeInput
  trackingData: PaymentTrackingData
  metadata?: CardPaymentSagaMetadata
}

/** The charge-verified endpoint: a card saved in the Google account, after 3-D Secure */
export type GooglePayPaymentSagaDefinition = SagaDefinition<
  GooglePayPaymentContext,
  GooglePayPaymentStepResults
>

export interface GooglePayPaymentStepResults
  extends GooglePaySettlementStepResults {
  CHARGE_GOOGLE_PAY: {
    paymentResult: CardPaymentSuccessResponse
  }
}

export interface GooglePayPaymentContext
  extends PaymentContext<GooglePayPaymentStepResults> {
  /** Decrypted again by Valitor when charged, after 3-D Secure */
  input: GooglePayChargeVerifiedInput
  trackingData: PaymentTrackingData
  metadata?: CardPaymentSagaMetadata
}
