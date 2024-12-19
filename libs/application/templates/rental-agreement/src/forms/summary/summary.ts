import { buildCustomField, buildSection } from '@island.is/application/core'
import { summary } from '../../lib/messages'

export const Summary = buildSection({
  id: 'summary',
  title: summary.sectionName,
  children: [
    buildCustomField({
      id: 'summaryComponent',
      title: '',
      component: 'Summary',
    }),
  ],
})
