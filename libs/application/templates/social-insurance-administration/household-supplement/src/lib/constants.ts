import { householdSupplementFormMessage } from './messages'
import { MessageDescriptor } from 'react-intl'

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

export enum AttachmentTypes {
  LEASE_AGREEMENT = 'leaseAgreement',
  SCHOOL_CONFIRMATION = 'schoolConfirmation',
  ADDITIONAL_DOCUMENTS = 'additionalDocuments',
}
