import { parseGrantDate } from './utils'

describe('parseGrantDate', () => {
  it('returns the hour when the time is exactly on the hour, no seconds', () => {
    const result = parseGrantDate(new Date(Date.UTC(2026, 9, 1, 23, 0, 0)))

    expect(result).toEqual({ date: '2026-10-01', hour: 23 })
  })

  it('returns the hour at the 23:59:00 boundary (not yet "end of day")', () => {
    const result = parseGrantDate(new Date(Date.UTC(2026, 9, 1, 23, 59, 0)))

    expect(result).toEqual({ date: '2026-10-01', hour: 23 })
  })

  it('omits the hour for 23:59:01 ("end of day" marker)', () => {
    const result = parseGrantDate(new Date(Date.UTC(2026, 9, 1, 23, 59, 1)))

    expect(result).toEqual({ date: '2026-10-01' })
    expect(result).not.toHaveProperty('hour')
  })

  it('omits the hour for 23:59:59 (the actual Rannis case)', () => {
    const result = parseGrantDate(new Date(Date.UTC(2026, 9, 1, 23, 59, 59)))

    expect(result).toEqual({ date: '2026-10-01' })
    expect(result).not.toHaveProperty('hour')
  })

  it('omits the hour at midnight', () => {
    const result = parseGrantDate(new Date(Date.UTC(2026, 9, 1, 0, 0, 0)))

    expect(result).toEqual({ date: '2026-10-01' })
    expect(result).not.toHaveProperty('hour')
  })

  it('returns the hour for an unaffected mid-day time', () => {
    const result = parseGrantDate(new Date(Date.UTC(2026, 9, 1, 14, 30, 0)))

    expect(result).toEqual({ date: '2026-10-01', hour: 14 })
  })
})
