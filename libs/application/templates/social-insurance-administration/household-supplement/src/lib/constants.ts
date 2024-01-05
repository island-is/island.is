import { householdSupplementFormMessage } from './messages'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
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
    socialInsuranceAdministrationMessage.confirm.additionalDocumentsAttachment,
}

export enum AttachmentTypes {
  LEASE_AGREEMENT = 'leaseAgreement',
  SCHOOL_CONFIRMATION = 'schoolConfirmation',
  ADDITIONAL_DOCUMENTS = 'additionalDocuments',
}
