import {
  buildSection,
  buildMultiField,
  buildFileUploadField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { UPLOAD_ACCEPT, FILE_SIZE_LIMIT } from '../../lib/constants'

export const attachments = buildSection({
  id: 'estateAttachments',
  title: m.attachmentsTitle,
  children: [
    buildMultiField({
      id: 'estateAttachments',
      title: m.attachmentsTitle,
      description: m.attachmentsDescription,
      children: [
        buildFileUploadField({
          id: 'estateAttachments.attached.file',
          title: m.attachmentsTitle,
          uploadAccept: UPLOAD_ACCEPT,
          uploadHeader: m.uploadHeader,
          uploadDescription: m.uploadDescription,
          uploadMultiple: true,
          maxSize: FILE_SIZE_LIMIT,
          uploadButtonLabel: m.attachmentsButton,
        }),
      ],
    }),
  ],
})
