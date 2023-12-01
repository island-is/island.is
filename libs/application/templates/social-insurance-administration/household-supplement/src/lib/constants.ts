import { DefaultEvents } from '@island.is/application/types'
import { householdSupplementFormMessage } from './messages'
import { MessageDescriptor } from 'react-intl'

export const YES = 'yes'
export const NO = 'no'

export const FILE_SIZE_LIMIT = 5000000 // 5MB

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.EDIT }
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: 'ADDITIONALDOCUMENTSREQUIRED' } // Ex: TR ask for more documents

export enum Roles {
  APPLICANT = 'applicant',
  ORGANIZATION_REVIEWER = 'tryggingastofnun',
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  DONE = 'done',

  TRYGGINGASTOFNUN_SUBMITTED = 'tryggingastofnunSubmitted',
  TRYGGINGASTOFNUN_IN_REVIEW = 'tryggingastofnunInReview',

  ADDITIONAL_DOCUMENTS_REQUIRED = 'additionalDocumentsRequired',

  REJECTED = 'rejected',
  APPROVED = 'approved',
}

export enum HouseholdSupplementHousing {
  HOUSEOWNER = 'houseOwner',
  RENTER = 'renter',
}

export enum AnswerValidationConstants {
  FILEUPLOAD = 'fileUpload',
}

export const AttachmentLabel: {
  [key: string]: MessageDescriptor
} = {
  leaseAgreement:
    householdSupplementFormMessage.confirm.leaseAgreementAttachment,
  schoolConfirmation:
    householdSupplementFormMessage.confirm.schoolConfirmationAttachment,
  additionalDocuments:
    householdSupplementFormMessage.confirm.additionalDocumentsAttachment,
}
export const MONTHS = [
  { value: 'January', label: householdSupplementFormMessage.months.january },
  { value: 'February', label: householdSupplementFormMessage.months.february },
  { value: 'March', label: householdSupplementFormMessage.months.march },
  { value: 'April', label: householdSupplementFormMessage.months.april },
  { value: 'May', label: householdSupplementFormMessage.months.may },
  { value: 'June', label: householdSupplementFormMessage.months.june },
  { value: 'July', label: householdSupplementFormMessage.months.july },
  { value: 'August', label: householdSupplementFormMessage.months.august },
  {
    value: 'September',
    label: householdSupplementFormMessage.months.september,
  },
  { value: 'October', label: householdSupplementFormMessage.months.october },
  { value: 'November', label: householdSupplementFormMessage.months.november },
  { value: 'December', label: householdSupplementFormMessage.months.desember },
]
