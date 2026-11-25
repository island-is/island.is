import { createIntl } from 'react-intl'
import type { FormatMessage } from '@island.is/localization'
import {
  formatDeviationLabel,
  formatPayStatusLabel,
  formatSalaryAnalysisGenderLabel,
  formatStig,
} from './salaryAnalysisLabels'

// Real react-intl over the bundled defaultMessages, so the ICU template in
// `deviationCell` is exercised rather than a stub that would pass whatever shape
// the helper happened to build.
const intl = createIntl({
  locale: 'is',
  defaultLocale: 'is',
  messages: {},
  onError: () => undefined,
})
const formatMessage = intl.formatMessage as FormatMessage

describe('formatPayStatusLabel', () => {
  // ON_LINE is the case the úrbótaáætlun table used to render and the ábendingar
  // table used to drop, leaving a bare percentage with no direction word.
  it('glosses all three statuses, ON_LINE included', () => {
    expect(formatPayStatusLabel('UNDERPAID', formatMessage)).toBe('undir')
    expect(formatPayStatusLabel('OVERPAID', formatMessage)).toBe('yfir')
    expect(formatPayStatusLabel('ON_LINE', formatMessage)).toBe('á línu')
  })
})

describe('formatSalaryAnalysisGenderLabel', () => {
  it('labels each gender, folding anything non-binary into Kynsegin', () => {
    expect(formatSalaryAnalysisGenderLabel('MALE', formatMessage)).toBe('Karl')
    expect(formatSalaryAnalysisGenderLabel('FEMALE', formatMessage)).toBe(
      'Kona',
    )
    expect(formatSalaryAnalysisGenderLabel('NEUTRAL', formatMessage)).toBe(
      'Kynsegin',
    )
  })
})

describe('formatDeviationLabel', () => {
  it('signs the figure and names the direction', () => {
    expect(formatDeviationLabel(3.94, 'OVERPAID', formatMessage)).toBe(
      '+3,9% (yfir)',
    )
    expect(formatDeviationLabel(-3.94, 'UNDERPAID', formatMessage)).toBe(
      '-3,9% (undir)',
    )
  })

  // Regression guard: the sign has to come from the ROUNDED magnitude, not the
  // raw value. Deriving it from the raw figure renders this as "-0,0%" — a
  // signed zero, which wageGap.spec pins as suppressed.
  it('suppresses the sign once the magnitude rounds to zero', () => {
    expect(formatDeviationLabel(-0.04, 'UNDERPAID', formatMessage)).toBe(
      '0,0% (undir)',
    )
    expect(formatDeviationLabel(0, 'ON_LINE', formatMessage)).toBe(
      '0,0% (á línu)',
    )
  })
})

describe('formatStig', () => {
  // The reported figure: summing the per-step weights leaves floating-point
  // noise on what is really a two-decimal number.
  it('trims floating-point noise to two decimals', () => {
    expect(formatStig(524.6700000000001)).toBe('524,67')
  })

  it('rounds a longer figure rather than truncating it', () => {
    expect(formatStig(524.6789)).toBe('524,68')
  })

  it('leaves a whole score whole', () => {
    expect(formatStig(524)).toBe('524')
    expect(formatStig(0)).toBe('0')
  })

  it('groups thousands the Icelandic way', () => {
    expect(formatStig(1234.5)).toBe('1.234,5')
  })

  // A dash, not a zero: a missing score is not a score of nothing.
  it('shows a dash for a missing score', () => {
    expect(formatStig(null)).toBe('—')
    expect(formatStig(undefined)).toBe('—')
  })
})
