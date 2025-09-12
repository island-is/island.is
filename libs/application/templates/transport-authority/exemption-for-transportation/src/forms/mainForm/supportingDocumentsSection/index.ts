import {
  buildFileUploadField,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { supportingDocuments } from '../../../lib/messages'
import { FILE_SIZE_LIMIT, FILE_TYPES_ALLOWED } from '../../../utils'

export const supportingDocumentsSection = buildSection({
  id: 'supportingDocumentsSection',
  title: supportingDocuments.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'supportingDocumentsMultiField',
      title: supportingDocuments.general.pageTitle,
      children: [
        // Comments
        buildTextField({
          id: 'supportingDocuments.comments',
          variant: 'textarea',
          rows: 5,
          title: supportingDocuments.labels.comments,
        }),

        // Supporting documents
        buildFileUploadField({
          id: 'supportingDocuments.files',
          introduction: '',
          uploadAccept: FILE_TYPES_ALLOWED,
          maxSize: FILE_SIZE_LIMIT,
          uploadMultiple: true,
          uploadHeader: supportingDocuments.labels.fileUploadHeader,
          uploadDescription: {
            ...supportingDocuments.labels.fileUploadDescription,
            values: { allowedTypes: FILE_TYPES_ALLOWED },
          },
          uploadButtonLabel: supportingDocuments.labels.fileUploadButtonLabel,
        }),
      ],
    }),
  ],
})
