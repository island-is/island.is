import { nationalIdsMatch } from './helpers'

describe('nationalIdsMatch', () => {
  it('should return true when national IDs match exactly', () => {
    expect(nationalIdsMatch('1234567890', '1234567890')).toBe(true)
  })

  it('should return true when national IDs match after sanitization', () => {
    expect(nationalIdsMatch('123456-7890', '1234567890')).toBe(true)
    expect(nationalIdsMatch('1234567890', '123456-7890')).toBe(true)
    expect(nationalIdsMatch('123456-7890', '123456-7890')).toBe(true)
  })

  it('should return false when national IDs do not match', () => {
    expect(nationalIdsMatch('1234567890', '0987654321')).toBe(false)
  })

  it('should return false when first national ID is null', () => {
    expect(nationalIdsMatch(null, '1234567890')).toBe(false)
  })

  it('should return false when second national ID is null', () => {
    expect(nationalIdsMatch('1234567890', null)).toBe(false)
  })

  it('should return false when both national IDs are null', () => {
    expect(nationalIdsMatch(null, null)).toBe(false)
  })

  it('should return false when first national ID is undefined', () => {
    expect(nationalIdsMatch(undefined, '1234567890')).toBe(false)
  })

  it('should return false when second national ID is undefined', () => {
    expect(nationalIdsMatch('1234567890', undefined)).toBe(false)
  })

  it('should return false when both national IDs are undefined', () => {
    expect(nationalIdsMatch(undefined, undefined)).toBe(false)
  })

  it('should return false when first national ID is empty string', () => {
    expect(nationalIdsMatch('', '1234567890')).toBe(false)
  })

  it('should return false when second national ID is empty string', () => {
    expect(nationalIdsMatch('1234567890', '')).toBe(false)
  })

  it('should return false when both national IDs are empty strings', () => {
    expect(nationalIdsMatch('', '')).toBe(false)
  })
})
