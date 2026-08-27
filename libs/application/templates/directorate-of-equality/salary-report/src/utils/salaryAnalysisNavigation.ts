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
