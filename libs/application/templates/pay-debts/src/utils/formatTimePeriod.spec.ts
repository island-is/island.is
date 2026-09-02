import { formatTimePeriod } from './formatTimePeriod'

describe('formatTimePeriod', () => {
  it('splits a YYYYMM period into year and month', () => {
    expect(formatTimePeriod('202508')).toBe('2025/08')
    expect(formatTimePeriod('202512')).toBe('2025/12')
  })

  it('returns an empty string for a missing period', () => {
    expect(formatTimePeriod('')).toBe('')
  })

  it('passes any other shape through untouched', () => {
    expect(formatTimePeriod('2025')).toBe('2025')
    expect(formatTimePeriod('20250801')).toBe('20250801')
    expect(formatTimePeriod('2025-08')).toBe('2025-08')
  })
})
