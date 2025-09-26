import {
  buildFileUploadField,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { supportingDocuments } from '../../../lib/messages'
import {
  checkIfExemptionTypeShortTerm,
  FILE_SIZE_LIMIT,
  FILE_TYPES_ALLOWED,
} from '../../../utils'
import { Application } from '@island.is/application/types'

export const supportingDocumentsSection = buildSection({
  id: 'supportingDocumentsSection',
  title: (application: Application) => {
    return checkIfExemptionTypeShortTerm(application.answers)
      ? supportingDocuments.general.sectionTitleShortTerm
      : supportingDocuments.general.sectionTitleLongTerm
  },
  children: [
    buildMultiField({
      id: 'supportingDocumentsMultiField',
      title: (application: Application) => {
        return checkIfExemptionTypeShortTerm(application.answers)
          ? supportingDocuments.general.pageTitleShortTerm
          : supportingDocuments.general.pageTitleLongTerm
      },
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
          condition: checkIfExemptionTypeShortTerm,
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
