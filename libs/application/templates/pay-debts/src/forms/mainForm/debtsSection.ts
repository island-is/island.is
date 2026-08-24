import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { debts as messages } from '../../lib/messages'

export const debtsSection = buildSection({
  id: 'debtsSection',
  title: messages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'debtsSection',
      title: messages.general.sectionTitle,
      children: [
        buildDescriptionField({
          id: 'description',
          title: messages.description.title,
          description: messages.description.description,
        }),
        buildTextField({
          id: 'input',
          title: messages.input.title,
          description: messages.input.description,
        }),
      ],
    }),
  ],
})
