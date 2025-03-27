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
