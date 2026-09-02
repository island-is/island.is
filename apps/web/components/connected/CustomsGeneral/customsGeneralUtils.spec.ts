import { formatValidityDate } from './customsGeneralUtils'

const INDEFINITE = 'Ótímabundið'

describe('formatValidityDate', () => {
  it('treats the sentinel end date as indefinite regardless of local timezone', () => {
    // A negative UTC offset would put this instant in year 2199 locally, so the
    // sentinel check has to read the year in UTC.
    expect(
      formatValidityDate('2200-01-01T00:00:00.000Z', INDEFINITE, 'is'),
    ).toBe(INDEFINITE)
  })

  it('formats dates that fall short of the sentinel year', () => {
    expect(
      formatValidityDate('2199-06-15T12:00:00.000Z', INDEFINITE, 'is'),
    ).not.toBe(INDEFINITE)
  })

  it('returns the fallback for missing or unparsable values', () => {
    expect(formatValidityDate(undefined, INDEFINITE, 'is')).toBe(INDEFINITE)
    expect(formatValidityDate(null, INDEFINITE, 'is')).toBe(INDEFINITE)
    expect(formatValidityDate('', INDEFINITE, 'is')).toBe(INDEFINITE)
    expect(formatValidityDate('not a date', INDEFINITE, 'is')).toBe(INDEFINITE)
  })
})
