import { getScaledValue } from './scale-value'

describe('getScaledValue', () => {
  it('should return 90% of the provided value', () => {
    expect(getScaledValue('100')).toBe(90)
  })

  it('should return 80% of the provided value', () => {
    expect(getScaledValue('100', 80)).toBe(80)
  })

  it('should convert Gi to Mi and return 70% of the provided value', () => {
    expect(getScaledValue('2Gi', 70)).toBe(1433) // 2Gi = 2048Mi
  })

  it('should throw an error when the percentage is over 100', () => {
    expect(() => getScaledValue('100', 110)).toThrow(
      'Ratio should be between 0 and 100 inclusive.',
    )
  })

  it('should throw an error when the percentage is below 0', () => {
    expect(() => getScaledValue('100', -10)).toThrow(
      'Ratio should be between 0 and 100 inclusive.',
    )
  })

  it('should handle decimal input values', () => {
    expect(getScaledValue('100.5')).toBe(90)
  })

  it('should handle negative input values', () => {
    expect(getScaledValue('-100', 80)).toBe(-80)
  })
})
