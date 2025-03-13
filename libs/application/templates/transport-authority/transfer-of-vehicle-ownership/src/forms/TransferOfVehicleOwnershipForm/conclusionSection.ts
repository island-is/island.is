import {
  buildSection,
  buildCustomField,
  buildMultiField,
} from '@island.is/application/core'
import { conclusion } from '../../lib/messages'

export const conclusionSection = buildSection({
  id: 'conclusion',
  title: conclusion.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'conclusion.multifield',
      title: conclusion.general.title,
      children: [
        buildCustomField({
          component: 'Conclusion',
          id: 'Conclusion',
          description: '',
        }),
      ],
    }),
  ],
})
