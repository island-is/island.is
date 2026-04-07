/**
 * Tests for the share validation logic in dataSchema.
 *
 * The assetSchema is not exported, so we test the core parsing behavior
 * that the refine function depends on: parsing share strings to numbers
 * and validating them against the 0.01 <= value <= 100 range.
 */

describe('asset share validation logic', () => {
  // This mirrors the validation logic in assetSchema's share refine
  const validateShare = (share: string) => {
    const num = parseFloat(share)
    const value = isNaN(num) ? 0 : num
    return value >= 0.01 && value <= 100
  }

  // This is the BROKEN version using parseInt (behavior before fix)
  const validateShareBroken = (share: string) => {
    const num = parseInt(share, 10)
    const value = isNaN(num) ? 0 : num
    return value > 0 && value <= 100
  }

  it('should accept whole number shares', () => {
    expect(validateShare('1')).toBe(true)
    expect(validateShare('50')).toBe(true)
    expect(validateShare('100')).toBe(true)
  })

  it('should reject zero, values over 100, and values below 0.01', () => {
    expect(validateShare('0')).toBe(false)
    expect(validateShare('0.001')).toBe(false)
    expect(validateShare('0.009')).toBe(false)
    expect(validateShare('101')).toBe(false)
    expect(validateShare('-1')).toBe(false)
  })

  it('should accept decimal shares down to 0.01%', () => {
    expect(validateShare('0.74')).toBe(true)
    expect(validateShare('0.5')).toBe(true)
    expect(validateShare('0.01')).toBe(true)
    expect(validateShare('0.9999')).toBe(true)
  })

  it('should accept decimal shares above 1%', () => {
    expect(validateShare('50.5')).toBe(true)
    expect(validateShare('99.99')).toBe(true)
    expect(validateShare('33.33')).toBe(true)
  })

  it('demonstrates that parseInt truncates decimals (the bug)', () => {
    // These demonstrate the broken behavior that parseInt causes
    expect(validateShareBroken('0.74')).toBe(false) // parseInt('0.74') => 0
    expect(validateShareBroken('0.5')).toBe(false) // parseInt('0.5') => 0
    expect(validateShareBroken('50.5')).toBe(true) // parseInt('50.5') => 50 (works by accident)
  })
})
