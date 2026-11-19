import { PageBuilder } from '@island.is/application/core'
import { FormItemTypes, SubSection } from '@island.is/application/types'

const fileUploadPage = new PageBuilder('fileUpload', 'File Upload')
  .addFileUploadField('fileUpload', 'File Upload')
  .build()

export const fileUploadSubsection: SubSection = {
  id: 'fileUpload',
  title: 'File Upload',
  type: FormItemTypes.SUB_SECTION,
  children: fileUploadPage.children,
}

// TODO: Add example with multiple files, max size, allowed file types, etc.
