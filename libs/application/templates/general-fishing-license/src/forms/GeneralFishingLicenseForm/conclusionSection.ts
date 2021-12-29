import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'

import { conclusion } from '../../lib/messages'

export const conclusionSection = buildSection({
  id: 'conclusionSection',
  title: conclusion.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'conclusion',
      title: conclusion.general.title,
      children: [
        buildCustomField({
          id: 'conclusionCustomField',
          title: '',
          doesNotRequireAnswer: true,
          component: 'Conclusion',
        }),
      ],
    }),
  ],
})
