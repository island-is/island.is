import { isValidRealEstate, valueToNumber } from './utils'

describe('isValidRealEstate', () => {
  it('should return false if F or L missing', () => {
    expect(isValidRealEstate('1')).toBe(false)
    expect(isValidRealEstate('23')).toBe(false)
    expect(isValidRealEstate('456')).toBe(false)
    expect(isValidRealEstate('7890')).toBe(false)
    expect(isValidRealEstate('56789')).toBe(false)
    expect(isValidRealEstate('123456')).toBe(false)
    expect(isValidRealEstate('9876543')).toBe(false)
  })

  it('Should return true if l/L with 6 letters, false otherwise', () => {
    expect(isValidRealEstate('L123456')).toBe(true)
    expect(isValidRealEstate('l987654')).toBe(true)
    expect(isValidRealEstate('l1')).toBe(false)
    expect(isValidRealEstate('L23')).toBe(false)
    expect(isValidRealEstate('L456')).toBe(false)
    expect(isValidRealEstate('l7890')).toBe(false)
    expect(isValidRealEstate('L56789')).toBe(false)
    expect(isValidRealEstate('L1234567')).toBe(false)
  })

  it('Should return true if f/F with 7 letters, false otherwise', () => {
    expect(isValidRealEstate('F1234567')).toBe(true)
    expect(isValidRealEstate('f9876543')).toBe(true)
    expect(isValidRealEstate('f1')).toBe(false)
    expect(isValidRealEstate('F23')).toBe(false)
    expect(isValidRealEstate('F456')).toBe(false)
    expect(isValidRealEstate('f7890')).toBe(false)
    expect(isValidRealEstate('F56789')).toBe(false)
    expect(isValidRealEstate('F123456')).toBe(false)
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

  it('should preserve negative sign when converting string to number', () => {
    expect(valueToNumber('-999')).toBe(-999)
    expect(valueToNumber('-999 kr.')).toBe(-999)
    expect(valueToNumber('-1.123.123', ',')).toBe(-1123123)
    expect(valueToNumber('-12.123.421.123,4233 kr.', ',')).toBe(-12123421123.4233)
    expect(valueToNumber('  -999  ')).toBe(-999)
  })

  it('should return number zero if not a number string', () => {
    expect(valueToNumber(false)).toBe(0)
    expect(valueToNumber('')).toBe(0)
    expect(valueToNumber(undefined)).toBe(0)
    expect(valueToNumber({})).toBe(0)
    expect(valueToNumber([])).toBe(0)
  })
})
