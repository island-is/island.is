import type { WageGapDecompositionDto } from '@island.is/clients/directorate-of-equality'
import { deriveWageGapState, formatPercentMagnitude } from './wageGap'

const decomposition = (
  overrides: Partial<WageGapDecompositionDto>,
): WageGapDecompositionDto =>
  ({
    benchmarkPercent: 3.9,
    counts: { male: 10, female: 10, excluded: 0 },
    oskyrtAvailable: true,
    oskyrtBlockers: [],
    rawGapAvailable: true,
    rawGapBlockers: [],
    warnings: [],
    gapCarrierCount: 0,
    minimumSetSize: 0,
    ...overrides,
  } as WageGapDecompositionDto)

describe('deriveWageGapState', () => {
  it('reports unknown when there is no decomposition at all', () => {
    expect(deriveWageGapState(undefined, 0)).toEqual({ kind: 'unknown' })
  })

  it('treats a null verdict as "cannot say", not as either verdict', () => {
    const state = deriveWageGapState(
      decomposition({ oskyrtWithinBenchmark: null }),
      0,
    )
    expect(state.kind).toBe('unknown')
  })

  it('reports withinBenchmark only on an explicit true', () => {
    expect(
      deriveWageGapState(decomposition({ oskyrtWithinBenchmark: true }), 0)
        .kind,
    ).toBe('withinBenchmark')
  })

  // The regression this whole helper exists for. Previously the screen inferred
  // compliance from an empty outlier list and showed a green success alert.
  it('an empty outlier list does NOT mean compliant', () => {
    // DMR's verified minimal case: four employees on one starfsmatsstig,
    // óskýrt 4,88%, two carriers, nothing listed.
    const state = deriveWageGapState(
      decomposition({
        oskyrtWithinBenchmark: false,
        gapCarrierCount: 2,
        minimumSetSize: 0,
        counts: { male: 2, female: 2, excluded: 0 },
      }),
      0,
    )
    expect(state.kind).toBe('overBenchmarkNoList')
    expect(state).toMatchObject({ reason: 'allOvershoot' })
  })

  it('distinguishes an empty list caused by nobody carrying the gap', () => {
    const state = deriveWageGapState(
      decomposition({ oskyrtWithinBenchmark: false, gapCarrierCount: 0 }),
      0,
    )
    expect(state).toMatchObject({
      kind: 'overBenchmarkNoList',
      reason: 'noCarriers',
    })
  })

  it('is compliant with a non-empty list — the list is not the verdict', () => {
    expect(
      deriveWageGapState(decomposition({ oskyrtWithinBenchmark: true }), 3)
        .kind,
    ).toBe('withinBenchmark')
  })

  it('reports overBenchmark with the list count when over and listed', () => {
    expect(
      deriveWageGapState(decomposition({ oskyrtWithinBenchmark: false }), 2),
    ).toEqual({ kind: 'overBenchmark', benchmarkPercent: 3.9, outlierCount: 2 })
  })

  describe('single-gender workforce', () => {
    const state = deriveWageGapState(
      decomposition({
        oskyrtAvailable: false,
        oskyrtBlockers: ['EMPTY_FEMALE_COHORT'],
        oskyrtWithinBenchmark: null,
        counts: { male: 12, female: 0, excluded: 0 },
      }),
      0,
    )

    it('is notComputable, not a gap of zero', () => {
      expect(state.kind).toBe('notComputable')
    })

    // Structural guard: the variant carries no percentage field, so "render 0%"
    // is not merely discouraged — there is nothing to render.
    it('carries no percentage to render', () => {
      expect(state).not.toHaveProperty('oskyrtPercent')
      expect(state).not.toHaveProperty('rawGapPercent')
    })

    it('still carries the real counts, which are the actionable part', () => {
      expect(state).toMatchObject({ counts: { male: 12, female: 0 } })
    })

    it('takes precedence over the verdict flag', () => {
      const contradictory = deriveWageGapState(
        decomposition({
          oskyrtAvailable: false,
          oskyrtBlockers: ['EMPTY_MALE_COHORT'],
          oskyrtWithinBenchmark: true,
        }),
        0,
      )
      expect(contradictory.kind).toBe('notComputable')
    })
  })
})

describe('formatPercentMagnitude', () => {
  it('drops the sign — direction is carried by a word, not a minus', () => {
    expect(formatPercentMagnitude(-3.94)).toBe('3,9')
    expect(formatPercentMagnitude(3.94)).toBe('3,9')
  })

  it('uses an Icelandic decimal comma', () => {
    expect(formatPercentMagnitude(0)).toBe('0,0')
    expect(formatPercentMagnitude(12.35)).toBe('12,4')
  })

  it('renders a missing value as zero rather than NaN', () => {
    expect(formatPercentMagnitude(null)).toBe('0,0')
  })
})
