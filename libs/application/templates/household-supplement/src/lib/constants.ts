import { DefaultEvents } from '@island.is/application/types'
import { householdSupplementFormMessage } from './messages'
import { MessageDescriptor } from 'react-intl'

export const YES = 'yes'
export const NO = 'no'

export const FILE_SIZE_LIMIT = 5000000 // 5MB

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.EDIT }

export enum Roles {
  APPLICANT = 'applicant',
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  DONE = 'done',
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
