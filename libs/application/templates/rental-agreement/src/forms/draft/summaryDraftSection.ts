import {
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { summary } from '../../lib/messages'

export const SummaryDraftSection = buildSection({
  id: 'summary',
  title: summary.sectionName,
  children: [
    buildMultiField({
      id: 'summary',
      title: '',
      children: [
        buildDescriptionField({
          id: 'summaryTitle',
          title: summary.pageTitle,
          marginBottom: 2,
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
          id: 'summaryEditComponent',
          title: 'Samantekt',
          component: 'SummaryEdit',
        }),
        buildSubmitField({
          id: 'toSummary',
          title: 'í yfirlit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: 'Áfram í yfirlit',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
