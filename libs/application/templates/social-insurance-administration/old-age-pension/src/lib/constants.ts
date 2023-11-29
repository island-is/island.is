import { DefaultEvents } from '@island.is/application/types'
import { oldAgePensionFormMessage } from './messages'
import { MessageDescriptor } from 'react-intl'

export const YES = 'yes'
export const NO = 'no'
export const oldAgePensionAge = 67
export const earlyRetirementMinAge = 65
export const earlyRetirementMaxAge = 66
export const fishermenMinAge = 60
export const fishermenMaxAge = 66
export const IS = 'IS'
export const employeeRatio = 50

export const MONTHS = [
  { value: 'January', label: oldAgePensionFormMessage.period.january },
  { value: 'February', label: oldAgePensionFormMessage.period.february },
  { value: 'March', label: oldAgePensionFormMessage.period.march },
  { value: 'April', label: oldAgePensionFormMessage.period.april },
  { value: 'May', label: oldAgePensionFormMessage.period.may },
  { value: 'June', label: oldAgePensionFormMessage.period.june },
  { value: 'July', label: oldAgePensionFormMessage.period.july },
  { value: 'August', label: oldAgePensionFormMessage.period.august },
  {
    value: 'September',
    label: oldAgePensionFormMessage.period.september,
  },
  { value: 'October', label: oldAgePensionFormMessage.period.october },
  { value: 'November', label: oldAgePensionFormMessage.period.november },
  { value: 'December', label: oldAgePensionFormMessage.period.desember },
]

export const FILE_SIZE_LIMIT = 5000000 // 5MB

export enum OAPEvents {
  ADDITIONALDOCUMENTSREQUIRED = 'ADDITIONALDOCUMENTSREQUIRED',
  INREVIEW = 'INREVIEW',
  PENDING = 'PENDING',
  DISMISSED = 'DISMISSED',
}

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.EDIT }
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: OAPEvents.ADDITIONALDOCUMENTSREQUIRED } // Ex: TR ask for more documents
  | { type: OAPEvents.INREVIEW } // Ex: TR's employee start review application
  | { type: OAPEvents.PENDING }
  | { type: OAPEvents.DISMISSED }
  | { type: DefaultEvents.ABORT }

export enum Roles {
  APPLICANT = 'applicant',
  ORGINIZATION_REVIEWER = 'tryggingastofnun',
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',

  TRYGGINGASTOFNUN_SUBMITTED = 'tryggingastofnunSubmitted', // NYSKRAD = 91
  TRYGGINGASTOFNUN_IN_REVIEW = 'tryggingastofnunInReview', // I_VINNSLU = 562

  ADDITIONAL_DOCUMENTS_REQUIRED = 'additionalDocumentsRequired', // I_BID_GOGN_VANTAR = 1617

  REJECTED = 'rejected', // SYNJAD = 1281
  APPROVED = 'approved', // AFGREIDD = 563
}

export enum AnswerValidationConstants {
  PERIOD = 'period',
  FILEUPLOAD = 'fileUpload',
  VALIDATE_LATEST_EMPLOYER = 'employers',
  PAYMENTINFO = 'paymentInfo',
}

export enum TaxLevelOptions {
  INCOME = '0',
  FIRST_LEVEL = '1',
  SECOND_LEVEL = '2',
  THIRD_LEVEL = '3',
}

export enum ApplicationType {
  OLD_AGE_PENSION = 'oldAgePension',
  HALF_OLD_AGE_PENSION = 'halfOldAgePension',
  SAILOR_PENSION = 'sailorPension',
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
    oldAgePensionFormMessage.review.additionalDocumentsAttachment,
}

const married = 'Gift/ur'

export const maritalStatuses: {
  [key: string]: string
} = {
  '1': 'Ógift/ur',
  '3': married,
  '4': 'Ekkja/Ekkill',
  '5': 'Skilin/nn/ð að borði og sæng',
  '6': 'Fráskilin/nn/ð',
  '7': married,
  '8': married,
  '9': 'Óupplýst',
  '0': married,
  L: married,
}

export enum Employment {
  SELFEMPLOYED = 'selfEmployed',
  EMPLOYEE = 'employee',
}

export enum RatioType {
  YEARLY = 'yearly',
  MONTHLY = 'monthly',
}

export enum Actions {
  SEND_APPLICATION = 'sendApplication',
}

export enum BankAccountType {
  ICELANDIC = 'icelandic',
  FOREIGN = 'foreign',
}
