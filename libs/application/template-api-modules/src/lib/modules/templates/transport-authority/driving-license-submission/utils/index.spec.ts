import { formatPhoneNumber } from './index'

describe('Format Phone Number Before Submission', () => {
  it('should remove country code from phone number', () => {
    expect(formatPhoneNumber('6003543')).toBe('6003543')
    expect(formatPhoneNumber('0035401234567')).toBe('01234567')
    expect(formatPhoneNumber('00354 01234567')).toBe('01234567')
    expect(formatPhoneNumber('+35401234567')).toBe('01234567')
    expect(formatPhoneNumber('+354 01234567')).toBe('01234567')
    expect(formatPhoneNumber(' +35401234567')).toBe('01234567')
    expect(formatPhoneNumber(' +354 012 34567 ')).toBe('01234567')
    expect(formatPhoneNumber('+354 012 34567 ')).toBe('01234567')
  })

  it('should remove all non-digits from phone number', () => {
    expect(formatPhoneNumber('012-345-67')).toBe('01234567')
    expect(formatPhoneNumber('00354 012 345 67')).toBe('01234567')
  })
})
