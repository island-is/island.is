import {
  formatDateValue,
  isRemedyDateInWindow,
  remedyDateBounds,
  toDateInputValue,
} from './dates'

// Guards the crossing DatePickerController can't make for itself: it reads
// `yyyy-MM-dd`, while a date-only value coming back from DMR has been through
// the generated client's `new Date(...)` transformer and externalData's JSON
// round-trip by the time the form sees it.
describe('toDateInputValue', () => {
  it('passes a date-only value through untouched', () => {
    expect(toDateInputValue('2027-03-01')).toBe('2027-03-01')
  })

  it('takes the date off an ISO instant without shifting it', () => {
    expect(toDateInputValue('2027-03-01T00:00:00.000Z')).toBe('2027-03-01')
    expect(toDateInputValue(new Date('2027-03-01T00:00:00.000Z'))).toBe(
      '2027-03-01',
    )
  })

  // The picker treats '' as "nothing selected"; null/undefined reach here from
  // the nullable draft field.
  it('reads a missing value as blank', () => {
    expect(toDateInputValue(undefined)).toBe('')
    expect(toDateInputValue(null)).toBe('')
    expect(toDateInputValue('')).toBe('')
  })
})

describe('formatDateValue', () => {
  it('writes a date the way an Icelandic reader does', () => {
    expect(formatDateValue('2027-03-01')).toBe('1.3.2027')
  })

  it('shows an unparseable value as-is rather than throwing', () => {
    expect(formatDateValue('einhvern tímann')).toBe('einhvern tímann')
  })

  it('renders nothing for a missing value', () => {
    expect(formatDateValue(undefined)).toBe('')
    expect(formatDateValue(null)).toBe('')
  })
})

// A fixed "today" throughout: these assert the shape of the window, and a real
// clock would make the fixtures expire.
const NOW = new Date(2026, 7, 31, 14, 30)

describe('remedyDateBounds', () => {
  // The API requires a date in the future, so today itself is not offered.
  it('starts at tomorrow, at local midnight', () => {
    expect(remedyDateBounds(NOW).min).toEqual(new Date(2026, 8, 1))
  })

  // Measured from today, not from `min` — shifting the lower bound must not
  // shorten the window.
  it('ends three years out from today', () => {
    expect(remedyDateBounds(NOW).max).toEqual(new Date(2029, 7, 31))
  })
})

describe('isRemedyDateInWindow', () => {
  it('accepts a date inside the window', () => {
    expect(isRemedyDateInWindow('2027-03-01', NOW)).toBe(true)
  })

  it('accepts both ends of the window', () => {
    expect(isRemedyDateInWindow('2026-09-01', NOW)).toBe(true)
    expect(isRemedyDateInWindow('2029-08-31', NOW)).toBe(true)
  })

  it('rejects today and anything before it', () => {
    expect(isRemedyDateInWindow('2026-08-31', NOW)).toBe(false)
    expect(isRemedyDateInWindow('2026-08-30', NOW)).toBe(false)
    expect(isRemedyDateInWindow('2020-01-01', NOW)).toBe(false)
  })

  it('rejects a date past the far end', () => {
    expect(isRemedyDateInWindow('2029-09-01', NOW)).toBe(false)
  })

  // The whole point of re-checking a stored answer: what was in range when it
  // was picked is out of range once the draft has sat long enough.
  it('rejects a date that was valid when it was picked', () => {
    const picked = '2026-09-15'
    expect(isRemedyDateInWindow(picked, NOW)).toBe(true)
    expect(isRemedyDateInWindow(picked, new Date(2026, 9, 1))).toBe(false)
  })

  it('reads a missing or unparseable value as out of the window', () => {
    expect(isRemedyDateInWindow(undefined, NOW)).toBe(false)
    expect(isRemedyDateInWindow(null, NOW)).toBe(false)
    expect(isRemedyDateInWindow('', NOW)).toBe(false)
    expect(isRemedyDateInWindow('einhvern tímann', NOW)).toBe(false)
  })
})
