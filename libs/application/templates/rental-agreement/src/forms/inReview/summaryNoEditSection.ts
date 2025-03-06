import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { summary } from '../../lib/messages'

export const summaryNoEditSection = buildSection({
  id: 'summaryNoEditSection',
  title: 'Samantekt',
  children: [
    buildMultiField({
      id: 'summary',
      title: '',
      children: [
        buildDescriptionField({
          id: 'summaryTitle',
          title: summary.pageTitle,
          marginBottom: 3,
        }),
        buildDescriptionField({
          id: 'summaryFirstDescription',
          title: '',
          description: summary.pageDescriptionFirstParagraph,
        }),
        buildDescriptionField({
          id: 'summarySecondDescription',
          title: '',
          description: summary.pageDescriptionSecondparagraph,
        }),
        buildCustomField({
          id: 'SummaryNoEdit',
          title: 'Samantekt',
          component: 'SummaryNoEdit',
        }),
      ],
    }),
  ],
})
