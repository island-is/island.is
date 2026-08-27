import { buildMultiField, buildSection } from '@island.is/application/core'
import { messages } from '../../lib/messages'
import { buildReportOverviewFields } from '../mainForm/overviewSection'
import { hasSeenPostponeReceipt } from '../../utils/salaryAnalysisNavigation'

export const postponedReportSummarySection = buildSection({
  id: 'postponedReportSummary',
  title: messages.postponed.reportSummarySectionTitle,
  condition: hasSeenPostponeReceipt,
  children: [
    buildMultiField({
      id: 'postponedReportSummaryMultiField',
      title: messages.postponed.reportSummaryTitle,
      children: buildReportOverviewFields(false),
    }),
  ],
})
