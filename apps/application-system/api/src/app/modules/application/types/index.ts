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
