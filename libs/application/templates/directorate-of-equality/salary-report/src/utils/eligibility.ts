import { ApplicationContext } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import {
  isPostponeRequested,
  salaryAnalysisNeedsImprovementPlan,
} from './salaryAnalysisNavigation'

export const hasActiveEqualityReport = (ctx: ApplicationContext): boolean =>
  getValueViaPath<boolean>(
    ctx.application.externalData,
    'activeEqualityReport.data.hasActiveEqualityReport',
    false,
  ) === true

// Both halves, not just the postpone answer: nothing clears that answer in
// DRAFT, so an applicant who ticks "fresta" and then edits the data until the
// analysis lists no outliers still carries it at submit time. Postponing a plan
// that is not required would hand them the receipt and park the application in
// POSTPONED awaiting an úrbótaáætlun they have nothing to write. The overview
// already hides the postpone row behind the same question — see
// buildAnalysisSummaryOverviewField's showPostponeChoice.
export const hasPostponedOutlierPlan = (ctx: ApplicationContext): boolean =>
  salaryAnalysisNeedsImprovementPlan(
    ctx.application.answers,
    ctx.application.externalData,
  ) && isPostponeRequested(ctx.application.answers)
