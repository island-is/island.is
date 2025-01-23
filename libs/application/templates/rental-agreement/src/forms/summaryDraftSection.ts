import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { summary } from '../lib/messages'

export const SummaryDraftSection = buildSection({
  id: 'summary',
  title: summary.sectionName,
  children: [
    buildMultiField({
      id: 'summary',
      title: '',
      children: [
        buildCustomField({
          id: 'summaryEditComponent',
          title: 'Samantekt',
          component: 'SummaryEdit',
        }),
        buildSubmitField({
          id: 'toSummary',
          title: 'í yfirlit',
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
