import { isValidEmail, valueToNumber, nationalIdsMatch } from './helpers'

describe('isValidEmail', () => {
  it('should return false if email is malformed', () => {
    expect(isValidEmail('abc@abc')).toBe(false)
    expect(isValidEmail('test@test.is')).toBe(true)
    expect(isValidEmail('123')).toBe(false)
    expect(isValidEmail('abc')).toBe(false)
    expect(isValidEmail('123@123')).toBe(false)
    expect(isValidEmail('áþæöð@áþæöð.æði')).toBe(false)
  })
})

describe('valueToNumber', () => {
  it('should return a number taken from a string', () => {
    expect(valueToNumber('123')).toBe(123)
    expect(valueToNumber('123.123.123', '.')).toBe(123.123123)
    expect(valueToNumber('123,123,123', ',')).toBe(123.123123)
    expect(valueToNumber('12.123.421.123,4233 kr.', ',')).toBe(12123421123.4233)
    expect(valueToNumber('12.123.421.123,4233 kr.', '.')).toBe(12.1234211234233)
    expect(valueToNumber('1.123.123 kr', ',')).toBe(1123123)
    expect(valueToNumber('æ ð þ ö 123 ASDF _-?  4 __d')).toBe(1234)
  })

  it('should return number zero if not a number string', () => {
    expect(valueToNumber(false)).toBe(0)
    expect(valueToNumber('')).toBe(0)
    expect(valueToNumber(undefined)).toBe(0)
    expect(valueToNumber({})).toBe(0)
    expect(valueToNumber([])).toBe(0)
  })

  it('should return a negative value if number is negative', () => {
    expect(valueToNumber('-123')).toBe(-123)
    expect(valueToNumber('-123.123.123', '.')).toBe(-123.123123)
    expect(valueToNumber('-123,123,123', ',')).toBe(-123.123123)
    expect(valueToNumber('-12.123.421.123,4233 kr.', ',')).toBe(
      -12123421123.4233,
    )
    expect(valueToNumber('-12.123.421.123,4233 kr.', '.')).toBe(
      -12.1234211234233,
    )
    expect(valueToNumber('-1.123.123 kr', ',')).toBe(-1123123)
  })
})

describe('nationalIdsMatch', () => {
  it('should return true for matching national IDs', () => {
    expect(nationalIdsMatch('0101302209', '0101302209')).toBe(true)
    expect(nationalIdsMatch('1234567890', '1234567890')).toBe(true)
  })

  it('should return true for matching national IDs with different formats', () => {
    // kennitala sanitize removes hyphens
    expect(nationalIdsMatch('010130-2209', '0101302209')).toBe(true)
    expect(nationalIdsMatch('0101302209', '010130-2209')).toBe(true)
    expect(nationalIdsMatch('010130-2209', '010130-2209')).toBe(true)
  })

  it('should return false for non-matching national IDs', () => {
    expect(nationalIdsMatch('0101302209', '0101302399')).toBe(false)
    expect(nationalIdsMatch('1234567890', '0987654321')).toBe(false)
  })

  it('should return false for null or undefined inputs', () => {
    expect(nationalIdsMatch(null, '0101302209')).toBe(false)
    expect(nationalIdsMatch('0101302209', null)).toBe(false)
    expect(nationalIdsMatch(null, null)).toBe(false)
    expect(nationalIdsMatch(undefined, '0101302209')).toBe(false)
    expect(nationalIdsMatch('0101302209', undefined)).toBe(false)
    expect(nationalIdsMatch(undefined, undefined)).toBe(false)
  })

  it('should return false for empty strings', () => {
    expect(nationalIdsMatch('', '0101302209')).toBe(false)
    expect(nationalIdsMatch('0101302209', '')).toBe(false)
    expect(nationalIdsMatch('', '')).toBe(false)
  })
})
