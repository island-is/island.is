import {
  buildCustomField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { summary } from '../../lib/messages'

export const Summary = buildSection({
  id: 'summary',
  title: summary.pageTitle,
  children: [
    buildMultiField({
      id: 'summaryInfo',
      title: summary.pageTitle,
      description: summary.pageDescription,
      children: [
        buildCustomField({
          id: 'summaryComponent',
          title: summary.pageTitle,
          component: 'Summary',
        }),
      ],
    }),
  ],
})
