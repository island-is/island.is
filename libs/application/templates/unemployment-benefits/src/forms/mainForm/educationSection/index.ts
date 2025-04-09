import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { education as educationMessages } from '../../../lib/messages'

export const educationSection = buildSection({
  id: 'educationSection',
  title: educationMessages.general.sectionTitle,
  children: [
    buildMultiField({
      title: educationMessages.general.pageTitle,
      description: educationMessages.general.pageDescription,
      children: [
        buildDescriptionField({
          id: 'test',
        }),
      ],
    }),
  ],
})
