import format from 'date-fns/format'
import { mergeAnswers } from '@island.is/application/core'
import type { ExternalData, FormValue } from '@island.is/application/types'
import type {
  SalaryAnalysisOutlierDto,
  SalaryAnalysisResponseDto,
} from '@island.is/clients/directorate-of-equality'
import {
  adjustedGapForResult,
  benchmarkVerdictForResult,
  getAdjustedGap,
  getBenchmarkVerdict,
  hasMinimumSetOutliersInResult,
  isPostponeRequested,
  navigationAnswersForAnalysisResult,
  reviewOutlierPlanIsSubmittable,
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
        benchmarkVerdict: 'unknown',
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
        benchmarkVerdict: 'unknown',
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
          countBelowExpected: 1,
          countAboveExpected: 0,
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
            countBelowExpected: 1,
            countAboveExpected: 0,
          },
        } as Partial<SalaryAnalysisResponseDto>),
        { resetReviewed: true },
      ),
    ).toEqual({
      salaryAnalysis: {
        hasMinimumSetOutliers: false,
        benchmarkVerdict: 'unknown',
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
      // Over the benchmark with nobody listed is still over the benchmark —
      // the mirrored verdict must not read that as compliant.
    ).toEqual({
      salaryAnalysis: {
        hasMinimumSetOutliers: false,
        benchmarkVerdict: 'over',
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

describe('isPostponeRequested', () => {
  it('reads the postpone checkbox', () => {
    expect(
      isPostponeRequested({ salaryAnalysis: { postponed: ['yes'] } }),
    ).toBe(true)
  })

  // OutlierGroupPanel empties the array once the applicant reaches the plan
  // screen in a review state — the answer tracks the live intent, not history.
  it('reads a cleared or absent checkbox as not postponed', () => {
    expect(isPostponeRequested({ salaryAnalysis: { postponed: [] } })).toBe(
      false,
    )
    expect(isPostponeRequested({ salaryAnalysis: {} })).toBe(false)
    expect(isPostponeRequested({})).toBe(false)
  })
})

describe('reviewOutlierPlanIsSubmittable', () => {
  // Relative to today, not a literal: this predicate reads the clock through
  // isOutlierGroupSubmittable, so a pinned date would start failing the day it
  // fell out of the remedy-date window.
  const oneYearOut = () => {
    const now = new Date()
    return format(
      new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()),
      'yyyy-MM-dd',
    )
  }

  const completeGroup = (ordinals: number[]) => ({
    name: 'Hópur',
    reason: 'Ástæða',
    action: 'Aðgerð',
    remedyDate: oneYearOut(),
    signatureRole: 'Titill',
    employeeOrdinals: ordinals,
  })

  // The gap the window check closes: a date the applicant picked while it was
  // still in range, left to go stale in POSTPONED's 90-day window.
  it('refuses a plan whose remedy date has since passed', () => {
    expect(
      reviewOutlierPlanIsSubmittable(
        {
          salaryAnalysis: {
            outlierGroups: [
              { ...completeGroup([1]), remedyDate: '2020-01-01' },
            ],
          },
        },
        externalData(result(1)),
      ),
    ).toBe(false)
  })

  // The regression this predicate exists for: the postponing submit persists
  // outlierPlanReviewed: true, which is exactly what the old condition read.
  it('refuses a plan that only carries the draft-phase postpone flags', () => {
    const answers: FormValue = {
      salaryAnalysis: {
        postponed: ['yes'],
        hasMinimumSetOutliers: true,
        outlierPlanReviewed: true,
      },
    }

    expect(salaryAnalysisOutlierPlanIsReviewed(answers)).toBe(true)
    expect(reviewOutlierPlanIsSubmittable(answers)).toBe(false)
  })

  it('refuses an empty plan even once the postpone answer is cleared', () => {
    expect(
      reviewOutlierPlanIsSubmittable({
        salaryAnalysis: {
          postponed: [],
          hasMinimumSetOutliers: true,
          outlierPlanReviewed: true,
        },
      }),
    ).toBe(false)
  })

  it('refuses a group that is missing an explanation', () => {
    expect(
      reviewOutlierPlanIsSubmittable({
        salaryAnalysis: {
          hasMinimumSetOutliers: true,
          outlierGroups: [{ ...completeGroup([1]), action: '' }],
        },
      }),
    ).toBe(false)
  })

  it('refuses while an outlier from the snapshot sits in no group', () => {
    expect(
      reviewOutlierPlanIsSubmittable(
        { salaryAnalysis: { outlierGroups: [completeGroup([1])] } },
        externalData(result(2)),
      ),
    ).toBe(false)
  })

  // The postpone answer is cleared by a mount effect and only persisted on the
  // way off the plan screen, so a finished plan must not depend on it.
  it('accepts a complete plan while the postpone answer is still set', () => {
    expect(
      reviewOutlierPlanIsSubmittable(
        {
          salaryAnalysis: {
            postponed: ['yes'],
            outlierGroups: [completeGroup([1, 2])],
          },
        },
        externalData(result(2)),
      ),
    ).toBe(true)
  })

  it('accepts a complete plan covering every outlier', () => {
    expect(
      reviewOutlierPlanIsSubmittable(
        { salaryAnalysis: { outlierGroups: [completeGroup([1, 2])] } },
        externalData(result(2)),
      ),
    ).toBe(true)
  })

  // A group whose members were all freed is dropped before submission, so it
  // must neither complete a plan nor block one.
  it('ignores a group with no members', () => {
    const answers = (
      groups: ReturnType<typeof completeGroup>[],
    ): FormValue => ({
      salaryAnalysis: { hasMinimumSetOutliers: true, outlierGroups: groups },
    })

    expect(
      reviewOutlierPlanIsSubmittable(
        answers([completeGroup([1]), { ...completeGroup([]), reason: '' }]),
        externalData(result(1)),
      ),
    ).toBe(true)
    expect(reviewOutlierPlanIsSubmittable(answers([completeGroup([])]))).toBe(
      false,
    )
  })

  it('has nothing to check when no plan is needed at all', () => {
    expect(reviewOutlierPlanIsSubmittable({}, externalData(result(0)))).toBe(
      true,
    )
  })
})

// The overview screen reads the verdict from answers, so the mapping is pinned
// here rather than at the screen: neither "no measurable gap" nor "no result"
// may collapse into Nei.
describe('benchmark verdict', () => {
  const decomposition = (
    overrides: Record<string, unknown>,
  ): Partial<SalaryAnalysisResponseDto> =>
    ({ wageGapDecomposition: overrides } as Partial<SalaryAnalysisResponseDto>)

  it('maps compliance to within', () => {
    expect(
      benchmarkVerdictForResult(
        result(0, decomposition({ oskyrtWithinBenchmark: true })),
      ),
    ).toBe('within')
  })

  it('maps non-compliance to over, listed outliers or not', () => {
    expect(
      benchmarkVerdictForResult(
        result(2, decomposition({ oskyrtWithinBenchmark: false })),
      ),
    ).toBe('over')
    expect(
      benchmarkVerdictForResult(
        result(
          0,
          decomposition({ oskyrtWithinBenchmark: false, gapCarrierCount: 0 }),
        ),
      ),
    ).toBe('over')
  })

  it('keeps an unmeasurable gap out of both verdicts', () => {
    expect(
      benchmarkVerdictForResult(
        result(
          0,
          decomposition({
            oskyrtAvailable: false,
            oskyrtBlockers: ['EMPTY_MALE_COHORT'],
          }),
        ),
      ),
    ).toBe('notComputable')
    expect(
      benchmarkVerdictForResult(
        result(0, decomposition({ oskyrtWithinBenchmark: null })),
      ),
    ).toBe('unknown')
  })

  it('prefers the mirrored answer over the stored snapshot', () => {
    expect(
      getBenchmarkVerdict(
        { salaryAnalysis: { benchmarkVerdict: 'within' } },
        externalData(
          result(2, decomposition({ oskyrtWithinBenchmark: false })),
        ),
      ),
    ).toBe('within')
  })

  // Answers written before the mirror existed, and any state with neither.
  it('falls back to the snapshot, then to unknown', () => {
    expect(
      getBenchmarkVerdict(
        {},
        externalData(result(0, decomposition({ oskyrtWithinBenchmark: true }))),
      ),
    ).toBe('within')
    expect(getBenchmarkVerdict({})).toBe('unknown')
  })
})

// The review screens render the figure from answers, so the gate that decides
// whether there is a figure at all is pinned here.
describe('adjusted gap', () => {
  const withDecomposition = (
    overrides: Record<string, unknown>,
  ): SalaryAnalysisResponseDto =>
    result(0, {
      wageGapDecomposition: overrides,
    } as Partial<SalaryAnalysisResponseDto>)

  it('carries the figure and its direction when the gap is available', () => {
    expect(
      adjustedGapForResult(
        withDecomposition({
          oskyrtAvailable: true,
          oskyrtPercent: 3.2,
          oskyrtDirection: 'FEMALE',
        }),
      ),
    ).toEqual({ percent: 3.2, direction: 'FEMALE' })
  })

  it('has no figure when the decomposition could not compute one', () => {
    expect(
      adjustedGapForResult(withDecomposition({ oskyrtAvailable: false })),
    ).toBeUndefined()
    expect(
      adjustedGapForResult(withDecomposition({ oskyrtAvailable: true })),
    ).toBeUndefined()
  })

  it('defaults a missing direction to none rather than guessing one', () => {
    expect(
      adjustedGapForResult(
        withDecomposition({ oskyrtAvailable: true, oskyrtPercent: 0 }),
      ),
    ).toEqual({ percent: 0, direction: 'NONE' })
  })

  it('keeps the figure out of the mirrored answers when there is none', () => {
    expect(
      navigationAnswersForAnalysisResult(result(1), { resetReviewed: false })
        .salaryAnalysis,
    ).not.toHaveProperty('adjustedGapPercent')
  })

  it('prefers the mirrored answer over the stored snapshot', () => {
    expect(
      getAdjustedGap(
        {
          salaryAnalysis: {
            adjustedGapPercent: 1.5,
            adjustedGapDirection: 'MALE',
          },
        },
        externalData(
          withDecomposition({
            oskyrtAvailable: true,
            oskyrtPercent: 9,
            oskyrtDirection: 'FEMALE',
          }),
        ),
      ),
    ).toEqual({ percent: 1.5, direction: 'MALE' })
  })

  it('falls back to the snapshot, then to nothing', () => {
    expect(
      getAdjustedGap(
        {},
        externalData(
          withDecomposition({
            oskyrtAvailable: true,
            oskyrtPercent: 9,
            oskyrtDirection: 'FEMALE',
          }),
        ),
      ),
    ).toEqual({ percent: 9, direction: 'FEMALE' })
    expect(getAdjustedGap({})).toBeUndefined()
  })
})
