import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildFileUploadField,
  buildTextField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const incomeSection = buildSection({
  id: 'incomeSection',
  title: m.draftMessages.incomeSection.title,
  children: [
    buildMultiField({
      id: 'incomeMultiField',
      title: m.draftMessages.incomeSection.multiFieldTitle,
      description: m.draftMessages.incomeSection.multiFieldDescription,
      children: [
        buildDescriptionField({
          id: 'incomeDescription',
          title: m.draftMessages.incomeSection.textFieldTitle,
          titleVariant: 'h3',
        }),
        buildTextField({
          id: 'incomeTextField',
          title: m.draftMessages.incomeSection.textFieldTitle,
          description: m.draftMessages.incomeSection.textFieldDescription,
          variant: 'textarea',
          rows: 4,
          marginBottom: 4,
        }),
        buildFileUploadField({
          id: 'incomeFileUploadField',
          title: m.draftMessages.incomeSection.fileUploadTitle,
          titleVariant: 'h3',
          description: m.draftMessages.incomeSection.fileUploadDescription,
          uploadAccept: '.pdf,.doc,.docx',
          uploadMultiple: true,
        }),
      ],
    }),
  ],
})
