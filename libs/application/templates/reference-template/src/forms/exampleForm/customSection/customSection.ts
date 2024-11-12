import {
  buildDescriptionField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'

export const customSection = buildSection({
  id: 'customSection',
  title: 'Custom section',
  children: [
    buildDescriptionField({
      id: 'customDescription',
      title: 'This is a custom section',
      description: m.customComponentDescription,
    }),
  ],
})
