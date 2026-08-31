import { getValueViaPath, YES } from '@island.is/application/core'
import type { ExternalData, FormValue } from '@island.is/application/types'
import type { SalaryAnalysisResponseDto } from '@island.is/clients/directorate-of-equality'
import { deriveWageGapState } from './wageGap'
import {
  isOutlierGroupSubmittable,
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

export type GapDirection = 'FEMALE' | 'MALE' | 'NONE'

export type AdjustedGap = { percent: number; direction: GapDirection }

export type SalaryAnalysisNavigationAnswers = {
  salaryAnalysis: {
    hasMinimumSetOutliers: boolean
    benchmarkVerdict: BenchmarkVerdict
    adjustedGapPercent?: number
    adjustedGapDirection?: GapDirection
    outlierPlanReviewed?: boolean
  }
}

// Same gate the analysis screen renders the figure behind: the leiðréttur gap
// is only a number when the decomposition says it could be computed.
export const adjustedGapForResult = (
  result: Pick<SalaryAnalysisResponseDto, 'wageGapDecomposition'>,
): AdjustedGap | undefined => {
  const decomposition = result.wageGapDecomposition
  if (
    !decomposition ||
    decomposition.oskyrtAvailable !== true ||
    typeof decomposition.oskyrtPercent !== 'number'
  ) {
    return undefined
  }

  return {
    percent: decomposition.oskyrtPercent,
    direction: decomposition.oskyrtDirection ?? 'NONE',
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

export const getAdjustedGap = (
  answers: FormValue,
  externalData?: ExternalData,
): AdjustedGap | undefined => {
  const percent = getValueViaPath<number>(
    answers,
    'salaryAnalysis.adjustedGapPercent',
  )
  if (typeof percent === 'number') {
    return {
      percent,
      direction:
        getValueViaPath<GapDirection>(
          answers,
          'salaryAnalysis.adjustedGapDirection',
        ) ?? 'NONE',
    }
  }

  const result = getSalaryAnalysisResult(externalData)
  return result ? adjustedGapForResult(result) : undefined
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

  // Absent rather than null when the gap could not be computed, so the keys
  // stay out of the answers entirely instead of mirroring a non-figure.
  const adjustedGap = adjustedGapForResult(result)
  if (adjustedGap) {
    salaryAnalysis.adjustedGapPercent = adjustedGap.percent
    salaryAnalysis.adjustedGapDirection = adjustedGap.direction
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
 * postponing is one of the ways to make it submittable — so it arrives in the
 * review states already `true` with no plan behind it, which is exactly the
 * state salaryAnalysisOutlierPlanIsReviewed reports as reviewed. This asks the
 * only question that matters instead: is there a plan, and does it cover every
 * outlier?
 *
 * Deliberately says nothing about `salaryAnalysis.postponed`. That answer is
 * cleared by a mount effect in OutlierGroupPanel and only persisted when the
 * applicant navigates off the plan screen, so refusing while it is still set
 * made the submit button hostage to an upstream screen's effect ordering — a
 * complete plan with a stale postpone answer would have been unsubmittable. The
 * completeness checks below already refuse the case that mattered: a postponed
 * report carries no groups at all.
 */
export const reviewOutlierPlanIsSubmittable = (
  answers: FormValue,
  externalData?: ExternalData,
): boolean => {
  if (!salaryAnalysisNeedsImprovementPlan(answers, externalData)) return true

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
  if (!assignedGroups.every((group) => isOutlierGroupSubmittable(group)))
    return false

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
