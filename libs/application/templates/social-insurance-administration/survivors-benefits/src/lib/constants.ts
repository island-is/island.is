import { DefaultEvents } from '@island.is/application/types'
import { survivorsBenefitsFormMessage } from './messages'
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
  PREREQUESITES = 'prerequesites',
  DRAFT = 'draft',
  DONE = 'done',
}

export const AttachmentLabel: {
  [key: string]: MessageDescriptor
} = {
  additionalDocuments:
    survivorsBenefitsFormMessage.confirm.additionalDocumentsAttachment,
}
