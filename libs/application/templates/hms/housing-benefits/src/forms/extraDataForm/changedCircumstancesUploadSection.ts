import {
  buildDescriptionField,
  buildFileUploadField,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { institutionRequestedChangedCircumstances } from '../../utils/extraDataFormConditions'

export const extraDataChangedCircumstancesUploadSection = buildSection({
  condition: institutionRequestedChangedCircumstances,
  id: 'extraDataCircumstancesSection',
  title: m.extraDataMessages.circumstancesUploadTitle,
  children: [
    buildMultiField({
      id: 'extraDataCircumstancesMultiField',
      title: m.extraDataMessages.circumstancesUploadTitle,
      description: m.extraDataMessages.circumstancesUploadDescription,
      children: [
        buildTextField({
          id: 'extraDataCircumstancesInput',
          placeholder: 'Lýsing...',
          rows: 8,
          variant: 'textarea',
          marginBottom: 4,
        }),
        buildFileUploadField({
          id: 'extraDataAttachments.changedCircumstances',
          title: m.extraDataMessages.documentChangedCircumstances,
          uploadAccept: '.pdf,.doc,.docx',
          uploadMultiple: true,
        }),
      ],
    }),
  ],
})
