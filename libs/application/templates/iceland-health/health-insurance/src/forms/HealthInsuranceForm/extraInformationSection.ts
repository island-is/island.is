import {
  buildFileUploadField,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../lib/messages/messages'
import { FILE_SIZE_LIMIT } from '../../utils/constants'

export const extraInformationSection = buildSection({
  id: 'extraInformationSection',
  title: m.extraInformationSectionTitle,
  children: [
    buildMultiField({
      id: 'extraInformationMultiField',
      title: m.extraInformationSectionTitle,
      children: [
        buildTextField({
          id: 'additionalRemarks',
          title: m.additionalRemarks,
          description: m.extraInformationSectionDescription,
          variant: 'textarea',
          rows: 4,
          placeholder: m.additionalRemarksPlaceholder,
        }),
        buildFileUploadField({
          id: 'additionalFiles',
          introduction: '',
          maxSize: FILE_SIZE_LIMIT,
          uploadHeader: m.fileUploadHeader,
          uploadDescription: m.fileUploadDescription,
          uploadButtonLabel: m.fileUploadButton,
        }),
      ],
    }),
  ],
})
