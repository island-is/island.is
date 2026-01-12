import { householdSupplementFormMessage } from './messages'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { MessageDescriptor } from 'react-intl'

export const AttachmentLabel: {
  [key: string]: MessageDescriptor
} = {
  schoolConfirmation:
    householdSupplementFormMessage.confirm.schoolConfirmationAttachment,
  additionalDocuments:
    socialInsuranceAdministrationMessage.confirm.additionalDocumentsAttachment,
}

export enum AttachmentTypes {
  SCHOOL_CONFIRMATION = 'schoolConfirmation',
  ADDITIONAL_DOCUMENTS = 'additionalDocuments',
}
