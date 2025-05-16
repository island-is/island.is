import {
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'

export const descriptionSection = buildSection({
  id: 'descriptionSection',
  title: m.descriptionMessages.title,
  children: [
    buildMultiField({
      id: 'descriptionMultiField',
      title: m.descriptionMessages.title,
      description: m.descriptionMessages.description,
      children: [
        buildTextField({
          id: 'description',
          title: m.descriptionMessages.textAreaLabel,
          placeholder: m.descriptionMessages.textAreaPlaceholder,
          variant: 'textarea',
          rows: 10,
        }),
      ],
    }),
  ],
})
