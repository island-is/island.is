import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { firstSection as messages } from '../../lib/messages'

export const firstSection = buildSection({
  id: 'firstSection',
  title: messages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'firstSection',
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
