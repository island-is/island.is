import {
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { messages } from '../../lib/messages'
import { buildReportOverviewFields } from '../mainForm/overviewSection'

export const draftRetryReportSummarySection = buildSection({
  id: 'draftRetryReportSummary',
  title: messages.draftRetry.reportSummarySectionTitle,
  children: [
    buildMultiField({
      id: 'draftRetryReportSummaryMultiField',
      title: messages.draftRetry.reportSummaryTitle,
      children: [
        ...buildReportOverviewFields(false),
        buildSubmitField({
          id: 'draftRetrySubmit',
          title: messages.draftRetry.submitButton,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: messages.draftRetry.submitButton,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
