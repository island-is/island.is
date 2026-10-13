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

// One screen for the whole review, mirroring the draft's own "Yfirlit": the
// submitted report, the analysis verdict, the úrbótaáætlun, and the button that
// sends it. Splitting the recap from the plan put the two halves of the same
// confirmation on separate screens, with the submit stranded away from the
// report it confirms.
export const postponedReviewSection = buildSection({
  id: 'postponedReportSummary',
  title: messages.postponed.reportSummarySectionTitle,
  children: [
    buildMultiField({
      id: 'postponedReportSummaryMultiField',
      title: messages.postponed.reportSummaryTitle,
      description: messages.postponed.intro,
      children: [
        ...buildReportOverviewFields(false),
        // No backId, so no "Breyta": the analysis is the submitted snapshot and
        // nothing in this state can change it. The plan below it can be edited,
        // and keeps its own.
        buildAnalysisSummaryOverviewField({
          id: 'postponedReviewAnalysis',
        }),
        buildOutlierPlanOverviewField({
          id: 'postponedReviewOutlierPlan',
          title: messages.postponed.reviewTitle,
          backId: ScreenIds.improvementPlan,
        }),
        buildOutlierPlanIncompleteAlertField({
          id: 'postponedReviewIncomplete',
        }),
        buildSubmitField({
          id: 'postponedSubmit',
          title: messages.postponed.submitButton,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: messages.postponed.submitButton,
              type: 'primary',
              condition: reviewOutlierPlanIsSubmittable,
            },
          ],
        }),
      ],
    }),
  ],
})
