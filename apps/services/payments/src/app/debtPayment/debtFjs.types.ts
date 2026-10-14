import type { PayInfo, ProblemDetailsDt } from '@island.is/clients/finance-v3'

import type { PaymentMethod } from '../../types'

export interface DebtFjsDebt {
  payId: string
  amount: number
}

export interface DebtFjsValidateInput {
  /** The payment flow id, also the payFlowId FJS knows the payment by. */
  flowId: string
  payerNationalId: string
  debts: DebtFjsDebt[]
  paymentDate: Date
}

export interface DebtFjsPayInput extends DebtFjsValidateInput {
  payInfo: PayInfo
  /** Ends the call earlier than the client wide timeout. */
  timeoutMs?: number
}

export type DebtFjsValidateOutcome =
  /** FJS accepts the debts and amounts, `paymentOptions` is parsed to our methods. */
  | {
      type: 'valid'
      paymentOptions: Set<PaymentMethod>
      rawPaymentOptions: string
    }
  /** FJS rejected the debts, permanently. */
  | { type: 'invalid'; problem?: ProblemDetailsDt }
  /** FJS already has a payment with this payFlowId. */
  | { type: 'already_registered'; problem?: ProblemDetailsDt }
  /** We could not tell, try again later. */
  | { type: 'transient'; error: unknown }

export type DebtFjsPayOutcome =
  /** 202 Accepted, FJS owns the payment from here. */
  | { type: 'registered'; dateCreated: string }
  /** FJS rejected the payment, permanently. */
  | { type: 'rejected'; problem?: ProblemDetailsDt }
  /** FJS already has a payment with this payFlowId, nothing new was registered. */
  | { type: 'already_registered'; problem?: ProblemDetailsDt }
  /** FJS may or may not have processed the call. */
  | { type: 'ambiguous'; error: unknown }
  /** FJS turned the call away while another payment for the debts is in progress, retry later. */
  | { type: 'busy'; problem?: ProblemDetailsDt }
  /** FJS did not process the call (authentication), safe to retry. */
  | { type: 'transient'; error: unknown }
