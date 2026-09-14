import {
  formatPhoneNumber,
  formatPhoneNumberWithIcelandicCountryCode,
  removeCountryCode,
} from './phone'

describe('formatPhoneNumber', () => {
  it('returns the same value if the phone number is already formatted', () => {
    expect(formatPhoneNumber('999-9999')).toBe('999-9999')
  })

  it('formats a 7-digit phone number', () => {
    expect(formatPhoneNumber('9999999')).toBe('999-9999')
  })

  it('returns the same value if the phone number is too long', () => {
    expect(formatPhoneNumber('99999999')).toBe('99999999')
  })

  it('returns the same value if the phone number is in an unexpected format', () => {
    expect(formatPhoneNumber('99999-99-9999')).toBe('99999-99-9999')
  })
})

describe('removeCountryCode', () => {
  it('strips an Icelandic +354 prefix and non-digits', () => {
    expect(removeCountryCode('+3547901234')).toBe('7901234')
  })

  it('strips an Icelandic 00354 prefix', () => {
    expect(removeCountryCode('003547901234')).toBe('7901234')
  })

  it('strips hyphens from a local number', () => {
    expect(removeCountryCode('790-1234')).toBe('7901234')
  })
})

describe('formatPhoneNumberWithIcelandicCountryCode', () => {
  it('formats a number with an Icelandic country code', () => {
    expect(formatPhoneNumberWithIcelandicCountryCode('+3547901234')).toBe(
      '+354 790-1234',
    )
  })

  it('formats a 7-digit local number', () => {
    expect(formatPhoneNumberWithIcelandicCountryCode('7901234')).toBe(
      '790-1234',
    )
  })

  it('returns the same value if the phone number is in an unexpected format', () => {
    expect(formatPhoneNumberWithIcelandicCountryCode('790-1234')).toBe(
      '790-1234',
    )
  })
})
