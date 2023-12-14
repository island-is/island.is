import { additionalSupportForTheElderyFormMessage } from './messages'
import { MessageDescriptor } from 'react-intl'

export const AttachmentLabel: {
  [key: string]: MessageDescriptor
} = {
  additionalDocuments:
    additionalSupportForTheElderyFormMessage.confirm
      .additionalDocumentsAttachment,
}
