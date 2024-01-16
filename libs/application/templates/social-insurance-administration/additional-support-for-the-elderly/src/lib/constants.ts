import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { MessageDescriptor } from 'react-intl'

export const AttachmentLabel: {
  [key: string]: MessageDescriptor
} = {
  additionalDocuments:
    socialInsuranceAdministrationMessage.confirm.additionalDocumentsAttachment,
}

export enum AttachmentTypes {
  ADDITIONAL_DOCUMENTS = 'additionalDocuments',
}
