import { mergeAnswers } from '@island.is/application/core'
import type { ExternalData, FormValue } from '@island.is/application/types'
import type {
  SalaryAnalysisOutlierDto,
  SalaryAnalysisResponseDto,
} from '@island.is/clients/directorate-of-equality'
import {
  hasMinimumSetOutliersInResult,
  navigationAnswersForAnalysisResult,
  salaryAnalysisNeedsImprovementPlan,
  salaryAnalysisOutlierPlanIsReviewed,
} from './salaryAnalysisNavigation'

// Derived rather than imported: the generated client does not re-export this
// one, so the app derives it wherever it is needed (see PayDispersionTable).
type PayDispersionEmployeeDto =
  SalaryAnalysisResponseDto['payDispersion']['employees'][number]

// Built out in full rather than cast from a stub: an array of partial rows is
// genuinely incomparable to its DTO (unlike the whole-response cast below, which
// TS allows because it only drops properties), and a stub behind `as unknown`
// would stop failing the day the DTO gains a required field.
const outlierRow = (ordinal: number): SalaryAnalysisOutlierDto => ({
  employeeOrdinal: ordinal,
  gender: 'FEMALE',
  score: 400,
  regularHourlyWage: 4000,
  expectedHourlyWage: 4400,
  deviationPercent: -9.1,
  payStatus: 'UNDERPAID',
})

const dispersionRow = (ordinal: number): PayDispersionEmployeeDto => ({
  employeeOrdinal: ordinal,
  gender: 'FEMALE',
  score: 400,
  regularHourlyWage: 4000,
  expectedHourlyWage: 4400,
  deviationPercent: -9.1,
  payStatus: 'UNDERPAID',
  studentizedResidual: -2.4,
})

const result = (
  outlierCount: number,
  overrides: Partial<SalaryAnalysisResponseDto> = {},
): SalaryAnalysisResponseDto =>
  ({
    outliers: Array.from({ length: outlierCount }, (_, index) =>
      outlierRow(index + 1),
    ),
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
    const answers: FormValue = {
      salaryAnalysis: {
        hasMinimumSetOutliers: true,
        outlierPlanReviewed: false,
      },
    }
    const data = externalData(
      result(0, {
        payDispersion: {
          available: true,
          blockers: [],
          population: 'ALL_EMPLOYEES',
          threshold: 2,
          employees: [dispersionRow(1)],
        },
      } as Partial<SalaryAnalysisResponseDto>),
    )

    expect(salaryAnalysisNeedsImprovementPlan(answers, data)).toBe(false)
    expect(salaryAnalysisOutlierPlanIsReviewed(answers, data)).toBe(true)
    expect(
      navigationAnswersForAnalysisResult(
        result(0, {
          payDispersion: {
            available: true,
            blockers: [],
            population: 'ALL_EMPLOYEES',
            threshold: 2,
            employees: [dispersionRow(1)],
          },
        } as Partial<SalaryAnalysisResponseDto>),
        { resetReviewed: true },
      ),
    ).toEqual({
      salaryAnalysis: {
        hasMinimumSetOutliers: false,
        outlierPlanReviewed: false,
      },
    })
  })

  it('does not require the improvement plan for over-benchmark results with no listed outliers', () => {
    const answers: FormValue = {
      salaryAnalysis: {
        hasMinimumSetOutliers: true,
        outlierPlanReviewed: false,
      },
    }
    const data = externalData(
      result(0, {
        wageGapDecomposition: {
          oskyrtWithinBenchmark: false,
          gapCarrierCount: 2,
          minimumSetSize: 0,
        },
      } as Partial<SalaryAnalysisResponseDto>),
    )

    expect(salaryAnalysisNeedsImprovementPlan(answers, data)).toBe(false)
    expect(salaryAnalysisOutlierPlanIsReviewed(answers, data)).toBe(true)
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
        outlierPlanReviewed: false,
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

  // The regression that shipped broken: stale no-outlier answers must not win
  // when a fresh analysis turns up real lágmarksmengi outliers.
  it('reopens the plan when a re-analysis turns up outliers after a compliant pass', () => {
    const persisted: FormValue = {
      salaryAnalysis: {
        hasMinimumSetOutliers: false,
        outlierPlanReviewed: true,
      },
    }

    const merged = mergeAnswers(
      persisted,
      navigationAnswersForAnalysisResult(result(3), { resetReviewed: true }),
    )

    expect(salaryAnalysisNeedsImprovementPlan(merged)).toBe(true)
    expect(salaryAnalysisOutlierPlanIsReviewed(merged)).toBe(false)
  })

  it('closes the plan again when a later analysis comes back compliant', () => {
    const persisted: FormValue = {
      salaryAnalysis: {
        hasMinimumSetOutliers: true,
        outlierPlanReviewed: false,
      },
    }

    const merged = mergeAnswers(
      persisted,
      navigationAnswersForAnalysisResult(result(0), { resetReviewed: true }),
    )

    expect(salaryAnalysisNeedsImprovementPlan(merged)).toBe(false)
    expect(salaryAnalysisOutlierPlanIsReviewed(merged)).toBe(true)
    expect(merged).toMatchObject({
      salaryAnalysis: {
        hasMinimumSetOutliers: false,
        outlierPlanReviewed: false,
      },
    })
  })

  it('falls back to restored externalData when local navigation answers are absent', () => {
    expect(
      salaryAnalysisNeedsImprovementPlan({}, externalData(result(1))),
    ).toBe(true)
    expect(
      salaryAnalysisOutlierPlanIsReviewed({}, externalData(result(1))),
    ).toBe(false)
  })

  it('lets a present result outrank stale local need answers', () => {
    const answers: FormValue = {
      salaryAnalysis: {
        hasMinimumSetOutliers: false,
        outlierPlanReviewed: true,
      },
    }

    expect(
      salaryAnalysisNeedsImprovementPlan(answers, externalData(result(1))),
    ).toBe(true)
    expect(
      salaryAnalysisOutlierPlanIsReviewed(answers, externalData(result(1))),
    ).toBe(false)
  })
})
