import {
  formatHourlyWage,
  formatPaidHours,
  paidHoursFromFormValue,
  paidHoursToFormValue,
} from './utils'

// Guards the migration from workRatio (a fraction scaled by 100 for display) to
// paidHours (an absolute count). A leftover *100 or /100 fails these.
describe('paidHours round-trip', () => {
  it.each([173.33, 4, 750, 160])('survives a round-trip unscaled: %p', (h) => {
    expect(paidHoursFromFormValue(paidHoursToFormValue(h))).toBe(h)
  })

  it('does not scale a full-time month into a percentage', () => {
    expect(paidHoursToFormValue(173.33)).toBe('173.33')
    expect(paidHoursFromFormValue('173.33')).toBe(173.33)
  })

  it('renders an absent value as empty rather than 0', () => {
    expect(paidHoursToFormValue(null)).toBe('')
    expect(paidHoursToFormValue(undefined)).toBe('')
  })

  // type="number" on an is-IS locale can hand back a comma; Number('173,33') is
  // NaN, which would silently submit 0 hours and inflate tímakaup.
  it('parses an Icelandic decimal comma', () => {
    expect(paidHoursFromFormValue('173,33')).toBe(173.33)
  })

  it('rounds to the API DECIMAL(6,2) precision', () => {
    expect(paidHoursFromFormValue('173.336')).toBe(173.34)
  })

  it('falls back to 0 on unparseable input rather than NaN', () => {
    expect(paidHoursFromFormValue('')).toBe(0)
    expect(paidHoursFromFormValue('abc')).toBe(0)
  })
})

describe('formatters', () => {
  it('labels paid hours as hours, not a percentage', () => {
    expect(formatPaidHours(173.33)).toBe('173,33 klst.')
  })

  it('labels wages per hour so they are not read as monthly figures', () => {
    expect(formatHourlyWage(4884)).toBe('4.884 kr./klst.')
  })
})
