import {
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { messages } from '../../lib/messages'
import { ScreenIds } from '../../utils/constants'
import { reviewOutlierPlanIsSubmittable } from '../../utils/salaryAnalysisNavigation'
import { buildAnalysisSummaryOverviewField } from '../analysisSummaryOverview'
import { buildReportOverviewFields } from '../mainForm/overviewSection'
import {
  buildOutlierPlanIncompleteAlertField,
  buildOutlierPlanOverviewField,
} from '../outlierPlanOverview'

// Mirrors postponedReviewSection field for field: both states are the applicant
// reviewing a submitted report before sending it back. Keep them in step.
export const draftRetryReportSummarySection = buildSection({
  id: 'draftRetryReportSummary',
  title: messages.draftRetry.reportSummarySectionTitle,
  children: [
    buildMultiField({
      id: 'draftRetryReportSummaryMultiField',
      title: messages.draftRetry.reportSummaryTitle,
      children: [
        ...buildReportOverviewFields(false),
        // No backId, so no "Breyta" — the analysis is a frozen snapshot here.
        // The plan below it is editable and keeps its own.
        buildAnalysisSummaryOverviewField({
          id: 'draftRetryReviewAnalysis',
        }),
        buildOutlierPlanOverviewField({
          id: 'draftRetryReviewOutlierPlan',
          title: messages.overview.outlierPlanTitle,
          backId: ScreenIds.improvementPlan,
        }),
        buildOutlierPlanIncompleteAlertField({
          id: 'draftRetryReviewIncomplete',
        }),
        buildSubmitField({
          id: 'draftRetrySubmit',
          title: messages.draftRetry.submitButton,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: messages.draftRetry.submitButton,
              type: 'primary',
              condition: reviewOutlierPlanIsSubmittable,
            },
          ],
        }),
      ],
    }),
  ],
})
