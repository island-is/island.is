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

// TODO: Add example with multiple files, max size, allowed file types, etc.
