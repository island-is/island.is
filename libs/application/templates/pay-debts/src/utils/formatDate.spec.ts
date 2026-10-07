import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('turns an FJS date into the Icelandic form', () => {
    expect(formatDate('2025-08-31')).toBe('31.08.2025')
  })

  it('keeps the day the FJS date names, whatever the local timezone', () => {
    expect(formatDate('2025-01-01')).toBe('01.01.2025')
    expect(formatDate('2025-12-31')).toBe('31.12.2025')
  })

  it.each(['00010101', '0001-01-01'])(
    'reports no date for the %s placeholder',
    (placeholder) => {
      expect(formatDate(placeholder)).toBeNull()
    },
  )

  it.each(['', 'not a date', '2025-13-45'])(
    'reports no date for %p rather than inventing one',
    (value) => {
      expect(formatDate(value)).toBeNull()
    },
  )
})
