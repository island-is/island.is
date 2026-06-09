import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { messages } from '../../lib/messages'

export const overviewSection = buildSection({
  id: 'overview',
  title: messages.overview.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewMultiField',
      title: messages.overview.title,
      description: messages.overview.intro,
      children: [
        buildDescriptionField({
          id: 'overview.placeholder',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
