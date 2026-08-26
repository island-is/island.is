import type { ExternalData, FormValue } from '@island.is/application/types'
import type { SalaryAnalysisResponseDto } from '@island.is/clients/directorate-of-equality'
import {
  hasMinimumSetOutliersInResult,
  navigationAnswersForAnalysisResult,
  salaryAnalysisNeedsImprovementPlan,
  salaryAnalysisOutlierPlanIsReviewed,
} from './salaryAnalysisNavigation'

const result = (
  outlierCount: number,
  overrides: Partial<SalaryAnalysisResponseDto> = {},
): SalaryAnalysisResponseDto =>
  ({
    outliers: Array.from({ length: outlierCount }, (_, index) => ({
      employeeOrdinal: index + 1,
    })),
    ...overrides,
  } as SalaryAnalysisResponseDto)

const externalData = (data: SalaryAnalysisResponseDto): ExternalData =>
  ({
    salaryAnalysisResult: {
      status: 'success',
      data,
    },
  } as unknown as ExternalData)

describe('salary analysis outlier navigation flags', () => {
  it('requires the improvement plan only for true minimum-set outliers', () => {
    expect(hasMinimumSetOutliersInResult(result(2))).toBe(true)
    expect(hasMinimumSetOutliersInResult(result(0))).toBe(false)
  })

  it('resets the review marker when a new result has minimum-set outliers', () => {
    expect(
      navigationAnswersForAnalysisResult(result(1), { resetReviewed: true }),
    ).toEqual({
      salaryAnalysis: {
        hasMinimumSetOutliers: true,
        outlierPlanReviewed: false,
      },
    })
  })

  it('does not reset a reviewed plan when restoring an existing outlier result', () => {
    expect(
      navigationAnswersForAnalysisResult(result(1), { resetReviewed: false }),
    ).toEqual({
      salaryAnalysis: {
        hasMinimumSetOutliers: true,
      },
    })
  })

  it('treats ábendingar-only results as not requiring the improvement plan', () => {
    expect(
      navigationAnswersForAnalysisResult(
        result(0, {
          payDispersion: {
            available: true,
            blockers: [],
            population: 'ALL_EMPLOYEES',
            threshold: 2,
            employees: [{ employeeOrdinal: 1 }],
          },
        } as Partial<SalaryAnalysisResponseDto>),
        { resetReviewed: true },
      ),
    ).toEqual({
      salaryAnalysis: {
        hasMinimumSetOutliers: false,
        outlierPlanReviewed: true,
      },
    })
  })

  it('does not require the improvement plan for over-benchmark results with no listed outliers', () => {
    expect(
      navigationAnswersForAnalysisResult(
        result(0, {
          wageGapDecomposition: {
            oskyrtWithinBenchmark: false,
            gapCarrierCount: 2,
            minimumSetSize: 0,
          },
        } as Partial<SalaryAnalysisResponseDto>),
        { resetReviewed: true },
      ),
    ).toEqual({
      salaryAnalysis: {
        hasMinimumSetOutliers: false,
        outlierPlanReviewed: true,
      },
    })
  })

  it('gates later sections until the required plan screen has been reviewed', () => {
    const answers: FormValue = {
      salaryAnalysis: { hasMinimumSetOutliers: true },
    }
    expect(salaryAnalysisNeedsImprovementPlan(answers)).toBe(true)
    expect(salaryAnalysisOutlierPlanIsReviewed(answers)).toBe(false)
    expect(
      salaryAnalysisOutlierPlanIsReviewed({
        salaryAnalysis: {
          hasMinimumSetOutliers: true,
          outlierPlanReviewed: true,
        },
      }),
    ).toBe(true)
  })

  it('falls back to restored externalData when local navigation answers are absent', () => {
    expect(
      salaryAnalysisNeedsImprovementPlan({}, externalData(result(1))),
    ).toBe(true)
    expect(
      salaryAnalysisOutlierPlanIsReviewed({}, externalData(result(1))),
    ).toBe(false)
  })
})
