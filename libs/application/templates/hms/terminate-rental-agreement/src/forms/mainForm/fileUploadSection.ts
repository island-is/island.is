import {
  buildFileUploadField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const fileUploadSection = buildSection({
  id: 'fileUploadSection',
  title: m.fileUploadMessages.title,
  children: [
    buildMultiField({
      id: 'fileUploadMultiField',
      title: m.fileUploadMessages.title,
      description: m.fileUploadMessages.description,
      children: [
        buildFileUploadField({
          id: 'fileUpload',
          // uploadMultiple: true, // TODO: Uncomment this once we have a way to upload multiple files
          // maxFileCount: 3,
        }),
      ],
    }),
  ],
})
