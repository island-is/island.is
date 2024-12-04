import {
  buildFileUploadField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { userInformation } from '../../../lib/messages'
import { FILE_SIZE_LIMIT, FILE_TYPES_ALLOWED } from '../../../shared'

export const supportingDocumentsSubSection = buildSubSection({
  id: 'supportingDocumentsSubSection',
  title: userInformation.supportingDocuments.subSectionTitle,
  children: [
    buildMultiField({
      id: 'supportingDocumentsMultiField',
      title: userInformation.supportingDocuments.pageTitle,
      description: userInformation.supportingDocuments.description,
      children: [
        buildFileUploadField({
          id: 'supportingDocuments.attachments',
          title: '',
          introduction: '',
          uploadAccept: FILE_TYPES_ALLOWED,
          maxSize: FILE_SIZE_LIMIT,
          uploadHeader: userInformation.supportingDocuments.fileUploadHeader,
          uploadDescription:
            userInformation.supportingDocuments.fileUploadDescription,
          uploadButtonLabel:
            userInformation.supportingDocuments.fileUploadButtonLabel,
        }),
      ],
    }),
  ],
})
