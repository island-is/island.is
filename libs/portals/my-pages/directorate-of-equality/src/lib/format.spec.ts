import {
  formatHourlyWage,
  formatPercent,
  formatPeriodMonth,
  formatThousands,
  getPeriodYear,
} from './format'

describe('format', () => {
  it('reads the payroll period in UTC', () => {
    expect(getPeriodYear('2026-01-01T00:00:00.000Z')).toBe(2026)
    expect(getPeriodYear(null)).toBeNull()
    expect(formatPeriodMonth('2026-01-01T00:00:00.000Z', 'en')).toBe(
      'January 2026',
    )
  })

  it('formats percentages with Icelandic decimal separator', () => {
    expect(formatPercent(8.5, 2)).toBe('8,50')
    expect(formatPercent(33.6, 1)).toBe('33,6')
  })

  it('formats currency values', () => {
    expect(formatHourlyWage(7631.4, 'kr./klst.')).toBe('7.631 kr./klst.')
    expect(formatThousands(15000)).toBe('15.000')
  })
})
