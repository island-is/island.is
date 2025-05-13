import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { summary } from '../../lib/messages'

export const summaryNoEditSection = buildSection({
  id: 'summaryNoEditSection',
  title: summary.sectionName,
  children: [
    buildMultiField({
      id: 'summary',
      children: [
        buildDescriptionField({
          id: 'summaryTitle',
          title: summary.pageTitle,
          marginBottom: 3,
        }),
        buildDescriptionField({
          id: 'summaryFirstDescription',
          description: summary.pageDescriptionFirstParagraph,
        }),
        buildDescriptionField({
          id: 'summarySecondDescription',
          description: summary.pageDescriptionSecondparagraph,
        }),
        buildCustomField({
          id: 'SummaryNoEdit',
          title: summary.sectionName,
          component: 'SummaryNoEdit',
        }),
      ],
    }),
  ],
})
