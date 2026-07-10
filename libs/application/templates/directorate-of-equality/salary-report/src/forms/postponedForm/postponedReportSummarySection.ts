import { buildMultiField, buildSection } from '@island.is/application/core'
import { messages } from '../../lib/messages'
import { buildReportOverviewFields } from '../mainForm/overviewSection'

export const postponedReportSummarySection = buildSection({
  id: 'postponedReportSummary',
  title: messages.postponed.reportSummarySectionTitle,
  children: [
    buildMultiField({
      id: 'postponedReportSummaryMultiField',
      title: messages.postponed.reportSummaryTitle,
      children: buildReportOverviewFields(false),
    }),
  ],
})
