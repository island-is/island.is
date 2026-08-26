import { getValueViaPath } from '@island.is/application/core'
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
  const answerFlag = getValueViaPath<boolean>(
    answers,
    'salaryAnalysis.hasMinimumSetOutliers',
  )
  if (typeof answerFlag === 'boolean') return answerFlag

  return hasMinimumSetOutliersInResult(getSalaryAnalysisResult(externalData))
}

export const salaryAnalysisOutlierPlanIsReviewed = (
  answers: FormValue,
  externalData?: ExternalData,
): boolean =>
  !salaryAnalysisNeedsImprovementPlan(answers, externalData) ||
  getValueViaPath<boolean>(answers, 'salaryAnalysis.outlierPlanReviewed') ===
    true

export const navigationAnswersForAnalysisResult = (
  result: Pick<SalaryAnalysisResponseDto, 'outliers'>,
  { resetReviewed }: { resetReviewed: boolean },
): FormValue => {
  const hasMinimumSetOutliers = hasMinimumSetOutliersInResult(result)
  const salaryAnalysis: FormValue = { hasMinimumSetOutliers }

  if (!hasMinimumSetOutliers) {
    salaryAnalysis.outlierPlanReviewed = true
  } else if (resetReviewed) {
    salaryAnalysis.outlierPlanReviewed = false
  }

  return { salaryAnalysis }
}
