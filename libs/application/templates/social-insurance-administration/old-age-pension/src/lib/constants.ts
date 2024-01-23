import { oldAgePensionFormMessage } from './messages'
import { MessageDescriptor } from 'react-intl'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'

export const oldAgePensionAge = 67
export const earlyRetirementMinAge = 65
export const earlyRetirementMaxAge = 66
export const fishermenMinAge = 60
export const fishermenMaxAge = 66
export const employeeRatio = 50

export enum RatioType {
  YEARLY = 'yearly',
  MONTHLY = 'monthly',
}

export enum AnswerValidationConstants {
  PERIOD = 'period',
}

export enum ApplicationType {
  OLD_AGE_PENSION = 'oldAgePension',
  HALF_OLD_AGE_PENSION = 'halfOldAgePension',
  SAILOR_PENSION = 'sailorPension',
}

export enum AttachmentTypes {
  PENSION = 'pension',
  EARLY_RETIREMENT = 'earlyRetirement',
  FISHERMAN = 'fishermen',
  SELF_EMPLOYED_ATTACHMENT = 'selfEmployedAttachment',
  ADDITIONAL_DOCUMENTS = 'additionalDocuments',
  FOREIGN_BANK_ACCOUNT = 'foreignBankAccount',
}

export const AttachmentLabel: {
  [key: string]: MessageDescriptor
} = {
  pension: oldAgePensionFormMessage.review.pensionAttachment,
  earlyRetirement: oldAgePensionFormMessage.review.earlyRetirementAttachment,
  fishermen: oldAgePensionFormMessage.review.fishermenAttachment,
  selfEmployedAttachment:
    oldAgePensionFormMessage.review.selfEmployedAttachment,
  additionalDocuments:
    socialInsuranceAdministrationMessage.confirm.additionalDocumentsAttachment,
}

export enum Employment {
  SELFEMPLOYED = 'selfEmployed',
  EMPLOYEE = 'employee',
}
