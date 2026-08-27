import { getValueViaPath, YES } from '@island.is/application/core'
import type { ExternalData, FormValue } from '@island.is/application/types'
import type { SalaryAnalysisResponseDto } from '@island.is/clients/directorate-of-equality'

export type AnalysisExternalData = {
  status?: 'success' | 'failure'
  data?: SalaryAnalysisResponseDto
  reason?: unknown
}

export const hasMinimumSetOutliersInResult = (
  result?: Pick<SalaryAnalysisResponseDto, 'outliers'> | null,
): boolean => (result?.outliers?.length ?? 0) > 0

export type SalaryAnalysisNavigationAnswers = {
  salaryAnalysis: {
    hasMinimumSetOutliers: boolean
    outlierPlanReviewed?: boolean
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

export const navigationAnswersForAnalysisResult = (
  result: Pick<SalaryAnalysisResponseDto, 'outliers'>,
  { resetReviewed }: { resetReviewed: boolean },
): SalaryAnalysisNavigationAnswers => {
  const hasMinimumSetOutliers = hasMinimumSetOutliersInResult(result)
  const salaryAnalysis: SalaryAnalysisNavigationAnswers['salaryAnalysis'] = {
    hasMinimumSetOutliers,
  }

  if (!hasMinimumSetOutliers) {
    salaryAnalysis.outlierPlanReviewed = false
  } else if (resetReviewed) {
    salaryAnalysis.outlierPlanReviewed = false
  }

  return { salaryAnalysis }
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
