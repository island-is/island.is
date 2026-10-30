import { ApplicationWithAttachments as Application } from '@island.is/application/types'
import { ProviderErrorReason } from '@island.is/shared/problem'
import { StaticText } from '@island.is/shared/types'

export interface DecodedAssignmentToken {
  applicationId: string
  state: string
  nonce: string
  iat: number
  exp: number
}

export interface StateChangeResult {
  error?: ProviderErrorReason | StaticText
  hasError: boolean
  hasChanged: boolean
  // Only set when the state machine ran without error but the state did not
  // change: false when no transition handled the event (e.g. every guard
  // failed), true for a matched self-transition that XState reports as
  // unchanged (no XState actions or context updates, such as an `assign` in
  // `entry`; meta.onEntry/onExit don't count). Undefined otherwise, so check
  // `hasError` and `hasChanged` first.
  hasMatchedTransition?: boolean
  application: Application
}

export interface TemplateAPIModuleActionResult {
  updatedApplication: Application
  hasError: boolean
  error?: ProviderErrorReason | StaticText
}

export interface ChargeResult {
  success: boolean
  error: Error | null
  data?: {
    paymentUrl: string
    user4: string
    receptionID: string
  }
}

export interface CallbackResult {
  success: boolean
  error: Error | null | string
  data?: Callback
}

export interface Callback {
  receptionID: string
  chargeItemSubject: string
  status: 'paid' | 'cancelled' | 'recreated' | 'recreatedAndPaid'
}
