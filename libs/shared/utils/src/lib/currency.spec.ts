import { CurrencyPostfix, formatCurrency } from './currency'

describe('formatCurrency', () => {
  it('formats a number with thousand separators and the default postfix', () => {
    expect(formatCurrency(1234567)).toBe('1.234.567 kr.')
  })

  it('formats a numeric string the same way as a number', () => {
    expect(formatCurrency('1234567')).toBe('1.234.567 kr.')
  })

  it('omits the postfix when an empty string is passed', () => {
    expect(formatCurrency(1000, '')).toBe('1.000')
  })

  it('uses a custom postfix when provided', () => {
    expect(formatCurrency(1000, CurrencyPostfix.isk)).toBe('1.000 kr.')
  })
})
