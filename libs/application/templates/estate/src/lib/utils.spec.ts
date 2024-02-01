import { isValidRealEstate } from './utils'

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
