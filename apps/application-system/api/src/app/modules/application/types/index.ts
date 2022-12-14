import { ApplicationWithAttachments as Application } from '@island.is/application/types'
import { ProviderErrorReason } from '@island.is/shared/problem'
import { StaticText } from 'static-text'

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
