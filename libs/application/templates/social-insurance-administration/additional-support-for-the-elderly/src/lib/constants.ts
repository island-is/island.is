//import { DefaultEvents } from '@island.is/application/types'
import { additionalSupportForTheElderyFormMessage } from './messages'
import { MessageDescriptor } from 'react-intl'

export const YES = 'yes'
export const NO = 'no'

export const AttachmentLabel: {
  [key: string]: MessageDescriptor
} = {
  additionalDocuments:
  additionalSupportForTheElderyFormMessage.confirm.additionalDocumentsAttachment,
}