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
