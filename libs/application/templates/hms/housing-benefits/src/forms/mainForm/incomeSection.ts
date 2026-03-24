import {
  buildDescriptionField,
  buildDisplayField,
  buildMultiField,
  buildSection,
  buildFileUploadField,
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
