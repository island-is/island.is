import { formatDateOnly, isDateOnlyString } from './dateUtils'

describe('isDateOnlyString', () => {
  it('accepts date-only strings', () => {
    expect(isDateOnlyString('2025-12-01')).toBe(true)
    expect(isDateOnlyString('1991-01-18')).toBe(true)
  })

  it('rejects datetimes, embedded dates and other formats', () => {
    expect(isDateOnlyString('2025-12-01T10:30:00')).toBe(false)
    expect(isDateOnlyString('2025-12-01 10:30')).toBe(false)
    expect(isDateOnlyString('Lyf | wer | 2026-08-19')).toBe(false)
    expect(isDateOnlyString('2025-1-1')).toBe(false)
    expect(isDateOnlyString('01.12.2025')).toBe(false)
    expect(isDateOnlyString('')).toBe(false)
  })
})

describe('formatDateOnly', () => {
  it('formats date-only strings as local calendar dates', () => {
    expect(formatDateOnly('2025-12-01')).toBe('01.12.2025')
    expect(formatDateOnly('1991-01-18')).toBe('18.01.1991')
  })

  it('supports a custom format', () => {
    expect(formatDateOnly('2025-12-01', 'yyyy')).toBe('2025')
  })

  it('returns the original value for impossible calendar dates', () => {
    expect(formatDateOnly('2024-02-31')).toBe('2024-02-31')
    expect(formatDateOnly('2025-13-01')).toBe('2025-13-01')
  })

  it('returns the original value for unparseable input', () => {
    expect(formatDateOnly('not a date')).toBe('not a date')
  })
})
