import { formatTimePeriod } from './formatTimePeriod'

describe('formatTimePeriod', () => {
  it('splits a YYYYMM period into year and month', () => {
    expect(formatTimePeriod('202508')).toBe('2025/8')
    expect(formatTimePeriod('202512')).toBe('2025/12')
  })

  it('returns an empty string for a missing period', () => {
    expect(formatTimePeriod('')).toBe('')
    expect(formatTimePeriod([])).toBe('')
  })

  it('passes any other shape through untouched', () => {
    expect(formatTimePeriod('2025')).toBe('2025')
    expect(formatTimePeriod('20250801')).toBe('20250801')
    expect(formatTimePeriod('2025-08')).toBe('2025-08')
  })

  it('renders a range from the earliest to the latest period', () => {
    expect(formatTimePeriod(['202412', '202505'])).toBe('2024/12-2025/5')
    expect(formatTimePeriod(['202505', '202412', '202501'])).toBe(
      '2024/12-2025/5',
    )
  })

  it('renders a single period when the array spans one period', () => {
    expect(formatTimePeriod(['202412'])).toBe('2024/12')
    expect(formatTimePeriod(['202412', '202412'])).toBe('2024/12')
  })

  it('ignores empty entries in the array', () => {
    expect(formatTimePeriod(['', '202412', '202505'])).toBe('2024/12-2025/5')
  })

  it('passes an array of unexpected shapes through untouched', () => {
    expect(formatTimePeriod(['2024-12', '2025-05'])).toBe('2024-12, 2025-05')
  })
})
