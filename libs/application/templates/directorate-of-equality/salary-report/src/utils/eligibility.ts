import { ApplicationContext } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import {
  isPostponeRequested,
  salaryAnalysisNeedsImprovementPlan,
} from './salaryAnalysisNavigation'

/**
 * DMR's machine-readable reason for refusing a salary report, shared by the
 * pre-flight check (`GET reports/salary/eligibility`) and the submit itself.
 * It is the only reason left since DMR dropped the six-month renewal window.
 */
export const SALARY_INELIGIBILITY_MISSING_EQUALITY_REPORT =
  'MISSING_EQUALITY_REPORT'

// The guard out of PREREQUISITES. Defaults to false, but the provider it reads
// throws rather than answering on an outage, so the transition is never
// evaluated against externalData that failed to arrive — the default only
// covers a shape DMR never sends.
export const isSalaryReportEligible = (ctx: ApplicationContext): boolean =>
  getValueViaPath<boolean>(
    ctx.application.externalData,
    'salaryReportEligibility.data.eligible',
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
