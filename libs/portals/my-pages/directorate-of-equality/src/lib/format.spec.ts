import {
  formatHourlyWage,
  formatKronur,
  formatPercent,
  formatSignedPercent,
  formatThousands,
} from './format'

describe('format', () => {
  it('formats percentages with Icelandic decimal separator', () => {
    expect(formatPercent(8.5, 2)).toBe('8,50')
    expect(formatPercent(33.6, 1)).toBe('33,6')
  })

  it('formats signed percentages', () => {
    expect(formatSignedPercent(65.8)).toBe('+65,8%')
    expect(formatSignedPercent(-14.4)).toBe('-14,4%')
    expect(formatSignedPercent(0)).toBe('0,0%')
  })

  it('formats currency values', () => {
    expect(formatKronur(64100)).toBe('64.100 kr.')
    expect(formatHourlyWage(7631.4)).toBe('7.631 kr./klst.')
    expect(formatThousands(15000)).toBe('15.000')
  })
})
