import type { WageGapDecompositionDto } from '@island.is/clients/directorate-of-equality'

export type WageGapCounts = { male: number; female: number; excluded: number }

/**
 * Why an empty outlier list is not one case: the selection walk declines a
 * candidate whose correction would push óskýrt further out, and it can decline
 * every one — leaving no listed employees on a company that is over the
 * benchmark. Inferring compliance from `outliers.length === 0` reports such a
 * company as compliant.
 *
 * `notComputable` deliberately carries no percentage field. A single-gender
 * workforce has no measurable gap, which is not the same as a gap of 0%, and
 * leaving the field off makes that unrenderable rather than merely discouraged.
 */
export type WageGapState =
  | { kind: 'unknown' }
  | {
      kind: 'notComputable'
      blockers: Array<'EMPTY_MALE_COHORT' | 'EMPTY_FEMALE_COHORT'>
      counts: WageGapCounts
    }
  | { kind: 'withinBenchmark'; benchmarkPercent: number }
  | { kind: 'overBenchmark'; benchmarkPercent: number; outlierCount: number }
  // Correcting the listed employees would carry the gap PAST the benchmark in
  // the other direction, so no subset of them lands inside it. A normal
  // category of report, not an error: it concentrates at small cohorts with
  // wide pay dispersion.
  | {
      kind: 'overBenchmarkOvershoots'
      benchmarkPercent: number
      outlierCount: number
    }
  | {
      kind: 'overBenchmarkNoList'
      benchmarkPercent: number
      // Which of the two non-compliance causes produced an empty list. The
      // third cause of an empty list — actual compliance — is `withinBenchmark`.
      reason: 'noCarriers' | 'allOvershoot'
    }

/**
 * Compliance is `oskyrtWithinBenchmark` and nothing else. `minimumSetClosesGap`
 * and `minimumSetSize` both look like they answer it and neither does — the
 * former tracked compliance only while the walk always named someone.
 */
export const deriveWageGapState = (
  decomposition: WageGapDecompositionDto | undefined | null,
  outlierCount: number,
): WageGapState => {
  if (!decomposition) return { kind: 'unknown' }

  const { benchmarkPercent, counts } = decomposition

  if (decomposition.oskyrtAvailable === false) {
    return {
      kind: 'notComputable',
      blockers: decomposition.oskyrtBlockers ?? [],
      counts,
    }
  }

  // Explicitly tri-state: null means "cannot say", which must not collapse into
  // either verdict via truthiness.
  if (decomposition.oskyrtWithinBenchmark == null) return { kind: 'unknown' }

  if (decomposition.oskyrtWithinBenchmark === true) {
    return { kind: 'withinBenchmark', benchmarkPercent }
  }

  if (outlierCount === 0) {
    return {
      kind: 'overBenchmarkNoList',
      benchmarkPercent,
      reason:
        decomposition.gapCarrierCount === 0 ? 'noCarriers' : 'allOvershoot',
    }
  }

  // Checked after the empty-list case: with nobody listed there is no set whose
  // correction could overshoot, so that branch is the more specific one.
  if (decomposition.minimumSetClosesGap === false) {
    return {
      kind: 'overBenchmarkOvershoots',
      benchmarkPercent,
      outlierCount,
    }
  }

  return { kind: 'overBenchmark', benchmarkPercent, outlierCount }
}

/**
 * Percentages are rendered as magnitudes with an explicit direction word, never
 * signed: with the denominator fixed, a 100/96 split reads 4,00% one way and
 * 4,17% the other, so a sign alone does not tell the reader which.
 */
export const formatPercentMagnitude = (
  value?: number | null,
  fractionDigits = 1,
): string =>
  Math.abs(value ?? 0).toLocaleString('is-IS', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
