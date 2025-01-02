import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { summary } from '../../lib/messages'

export const Summary = buildSection({
  id: 'summary',
  title: summary.sectionName,
  children: [
    buildMultiField({
      id: 'summary',
      title: '',
      children: [
        buildCustomField({
          id: 'summaryComponent',
          title: '',
          component: 'Summary',
        }),
      ],
    }),
  ],
})
