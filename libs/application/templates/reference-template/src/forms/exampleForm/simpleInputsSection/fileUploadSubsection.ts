import {
  buildFileUploadField,
  buildSubSection,
} from '@island.is/application/core'

export const fileUploadSubsection = buildSubSection({
  id: 'fileUpload',
  title: 'File Upload',
  children: [
    buildFileUploadField({
      id: 'fileUpload',
      title: 'File Upload',
    }),
  ],
})
