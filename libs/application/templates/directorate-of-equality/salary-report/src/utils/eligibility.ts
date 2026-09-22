import { Application, ApplicationContext } from '@island.is/application/types'
import { getValueViaPath } from '@island.is/application/core'
import {
  isPostponeRequested,
  salaryAnalysisNeedsImprovementPlan,
} from './salaryAnalysisNavigation'

/**
 * DMR's machine-readable reason for refusing a salary report, shared by the
 * pre-flight check (`GET reports/salary/eligibility`) and the submit itself.
 *
 * The order is the server's: a company that owes an equality plan is told about
 * that first, whatever its renewal window says.
 */
export const SALARY_INELIGIBILITY_MISSING_EQUALITY_REPORT =
  'MISSING_EQUALITY_REPORT'
export const SALARY_INELIGIBILITY_RENEWAL_WINDOW_NOT_OPEN =
  'RENEWAL_WINDOW_NOT_OPEN'

export type SalaryIneligibilityReason =
  | typeof SALARY_INELIGIBILITY_MISSING_EQUALITY_REPORT
  | typeof SALARY_INELIGIBILITY_RENEWAL_WINDOW_NOT_OPEN

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

export const getSalaryIneligibilityReason = (
  application: Application,
): SalaryIneligibilityReason | undefined =>
  getValueViaPath<SalaryIneligibilityReason>(
    application.externalData,
    'salaryReportEligibility.data.reason',
  )

// Documented nullable on the DTO — there is no window to anchor on until DMR
// has a due date for the company — so the screen needs a variant without it.
export const getEarliestSubmissionDate = (
  application: Application,
): string | undefined =>
  getValueViaPath<string>(
    application.externalData,
    'salaryReportEligibility.data.earliestSubmissionDate',
  )

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
