import { getValueViaPath, YES } from '@island.is/application/core'
import type { ExternalData, FormValue } from '@island.is/application/types'
import type { SalaryAnalysisResponseDto } from '@island.is/clients/directorate-of-equality'
import { deriveWageGapState } from './wageGap'
import {
  isOutlierGroupComplete,
  unassignedOutlierOrdinals,
  type OutlierGroupAnswer,
} from './outlierGroups'

export type AnalysisExternalData = {
  status?: 'success' | 'failure'
  data?: SalaryAnalysisResponseDto
  reason?: unknown
}

export const hasMinimumSetOutliersInResult = (
  result?: Pick<SalaryAnalysisResponseDto, 'outliers'> | null,
): boolean => (result?.outliers?.length ?? 0) > 0

// Mirrored into answers rather than read from externalData wherever a form
// screen needs it: the form shell seeds its reducer's externalData once at
// mount and only ADD_EXTERNAL_DATA updates it, which nothing in this template
// dispatches (updateApplicationExternalData writes server-side only, and
// addExternalData is not handed to custom fields). Answers do reach the
// reducer, through ANSWER and through each screen's own submit — so a screen
// that reads externalData directly reads it as of page load.
export type BenchmarkVerdict = 'within' | 'over' | 'notComputable' | 'unknown'

export type SalaryAnalysisNavigationAnswers = {
  salaryAnalysis: {
    hasMinimumSetOutliers: boolean
    benchmarkVerdict: BenchmarkVerdict
    outlierPlanReviewed?: boolean
  }
}

export const benchmarkVerdictForResult = (
  result: Pick<SalaryAnalysisResponseDto, 'outliers' | 'wageGapDecomposition'>,
): BenchmarkVerdict => {
  const state = deriveWageGapState(
    result.wageGapDecomposition,
    result.outliers?.length ?? 0,
  )

  switch (state.kind) {
    case 'withinBenchmark':
      return 'within'
    case 'notComputable':
      return 'notComputable'
    case 'unknown':
      return 'unknown'
    default:
      return 'over'
  }
}

export const getSalaryAnalysisResult = (
  externalData?: ExternalData,
): SalaryAnalysisResponseDto | undefined => {
  const salaryAnalysisResult = getValueViaPath<AnalysisExternalData>(
    externalData ?? {},
    'salaryAnalysisResult',
  )
  return salaryAnalysisResult?.status === 'success'
    ? salaryAnalysisResult.data
    : undefined
}

export const salaryAnalysisNeedsImprovementPlan = (
  answers: FormValue,
  externalData?: ExternalData,
): boolean => {
  const result = getSalaryAnalysisResult(externalData)
  if (result) return hasMinimumSetOutliersInResult(result)

  const answerFlag = getValueViaPath<boolean>(
    answers,
    'salaryAnalysis.hasMinimumSetOutliers',
  )
  return answerFlag === true
}

// DRAFT only. Postponing deliberately satisfies this — that is what the
// postpone choice buys the applicant. The review states must not reuse it; see
// reviewOutlierPlanIsSubmittable.
export const salaryAnalysisOutlierPlanIsReviewed = (
  answers: FormValue,
  externalData?: ExternalData,
): boolean => {
  if (!salaryAnalysisNeedsImprovementPlan(answers, externalData)) return true

  return (
    getValueViaPath<boolean>(
      answers,
      'salaryAnalysis.hasMinimumSetOutliers',
    ) === true &&
    getValueViaPath<boolean>(answers, 'salaryAnalysis.outlierPlanReviewed') ===
      true
  )
}

// Falls back to the stored snapshot only as a courtesy to answers written
// before this mirror existed; the answer is the live source.
export const getBenchmarkVerdict = (
  answers: FormValue,
  externalData?: ExternalData,
): BenchmarkVerdict => {
  const mirrored = getValueViaPath<BenchmarkVerdict>(
    answers,
    'salaryAnalysis.benchmarkVerdict',
  )
  if (mirrored) return mirrored

  const result = getSalaryAnalysisResult(externalData)
  return result ? benchmarkVerdictForResult(result) : 'unknown'
}

export const navigationAnswersForAnalysisResult = (
  result: Pick<SalaryAnalysisResponseDto, 'outliers' | 'wageGapDecomposition'>,
  { resetReviewed }: { resetReviewed: boolean },
): SalaryAnalysisNavigationAnswers => {
  const hasMinimumSetOutliers = hasMinimumSetOutliersInResult(result)
  const salaryAnalysis: SalaryAnalysisNavigationAnswers['salaryAnalysis'] = {
    hasMinimumSetOutliers,
    benchmarkVerdict: benchmarkVerdictForResult(result),
  }

  if (!hasMinimumSetOutliers) {
    salaryAnalysis.outlierPlanReviewed = false
  } else if (resetReviewed) {
    salaryAnalysis.outlierPlanReviewed = false
  }

  return { salaryAnalysis }
}

/**
 * The review-state submits (POSTPONED, DRAFT_RETRY) judge the plan itself and
 * never `outlierPlanReviewed`.
 *
 * That flag means "the DRAFT phase found the report submittable", and
 * postponing is one of the ways to make it submittable — so it arrives in
 * POSTPONED already `true` with no plan behind it, which is exactly the state
 * salaryAnalysisOutlierPlanIsReviewed reports as reviewed. It is corrected only
 * once SalaryImprovementPlan's effects have run and OutlierGroupPanel has
 * cleared `postponed`, which would leave an upstream screen's mount order as
 * the thing standing between an empty plan and editOutliers.
 *
 * Re-derived from the stored answers and the submitted analysis snapshot
 * instead, so it holds whether or not that screen has run. Fails closed: a
 * still-set postpone answer is a plan that was never written.
 */
export const reviewOutlierPlanIsSubmittable = (
  answers: FormValue,
  externalData?: ExternalData,
): boolean => {
  if (!salaryAnalysisNeedsImprovementPlan(answers, externalData)) return true
  if (isPostponeRequested(answers)) return false

  const groups =
    getValueViaPath<OutlierGroupAnswer[]>(
      answers,
      'salaryAnalysis.outlierGroups',
    ) ?? []
  // A group whose members were all freed carries no explanation and is dropped
  // before submission (see the service's editOutliers), so it must not be the
  // thing that makes a plan look complete — or incomplete.
  const assignedGroups = groups.filter(
    (group) => (group.employeeOrdinals?.length ?? 0) > 0,
  )

  if (assignedGroups.length === 0) return false
  if (!assignedGroups.every(isOutlierGroupComplete)) return false

  // Every listed outlier has to sit in a group — the same rule the plan
  // screen's Continue gate applies. Skipped when no snapshot is stored: there
  // is then no outlier list to check against, and the completeness of the
  // groups the applicant did write is all this can honestly assert.
  const outliers = getSalaryAnalysisResult(externalData)?.outliers
  return outliers
    ? unassignedOutlierOrdinals(outliers, assignedGroups).length === 0
    : true
}

// The applicant asked to hand the úrbótaáætlun in later. Cleared again by
// OutlierGroupPanel once they reach the plan screen in a review state, so it
// answers "is the plan being postponed *now*", not "was it ever postponed".
export const isPostponeRequested = (answers: FormValue): boolean =>
  getValueViaPath<string[]>(answers, 'salaryAnalysis.postponed', [])?.includes(
    YES,
  ) ?? false

// The POSTPONED receipt screen ("Sending móttekin") is a dead end on the visit
// that submitted the report: it is the only navigable screen there, so the
// applicant is handed the last-screen button instead of being walked straight
// into the úrbótaáætlun flow. PostponeReceiptMarker persists the flag while
// that screen renders — deliberately without telling the form shell, so the
// screen the applicant is looking at does not restructure under them. The next
// visit reads the persisted flag and skips the receipt.
export const hasSeenPostponeReceipt = (answers: FormValue): boolean =>
  getValueViaPath<boolean>(answers, 'salaryAnalysis.postponeReceiptSeen') ===
  true

export const hasNotSeenPostponeReceipt = (answers: FormValue): boolean =>
  !hasSeenPostponeReceipt(answers)
