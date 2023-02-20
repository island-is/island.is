import {
  buildSection,
  buildDescriptionField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'

export const informationSection = buildSection({
  id: 'informationSection',
  title: information.general.sectionTitle,
  children: [
    buildDescriptionField({
      id: 'test',
      title: 'Test',
      description: 'Test...',
    }),
  ],
})
