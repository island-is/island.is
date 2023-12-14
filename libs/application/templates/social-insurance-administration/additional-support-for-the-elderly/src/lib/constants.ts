import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/messages'
import { MessageDescriptor } from 'react-intl'

export enum TaxLevelOptions {
  INCOME = '2',
  FIRST_LEVEL = '1',
  SECOND_LEVEL = '3',
}

export const AttachmentLabel: {
  [key: string]: MessageDescriptor
} = {
  additionalDocuments:
    socialInsuranceAdministrationMessage.confirm.additionalDocumentsAttachment,
}
