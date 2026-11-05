import {
  getDefaultDate,
  isWorkday,
  parseLocalISODate,
  toLocalISODate,
} from './utils'

// jest.config.ts runs these ahead of UTC, where a local midnight is the
// previous day in UTC. Iceland's UTC+0 would hide the shift.
describe('dates in a browser ahead of UTC', () => {
  it('runs ahead of UTC', () => {
    expect(new Date(2026, 10, 20).getTimezoneOffset()).toBeLessThan(0)
  })

  it('formats a picked date as its own calendar day', () => {
    expect(toLocalISODate(new Date(2026, 10, 20))).toBe('2026-11-20')
  })

  it('reads a stored day back as local midnight on that day', () => {
    const date = parseLocalISODate('2026-11-20')
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([
      2026, 10, 20,
    ])
    expect(date.getHours()).toBe(0)
  })

  it('treats the holiday itself as a holiday, not the day before', () => {
    // 17 June 2026 is a Wednesday. Midday, like the dates built from now.
    expect(isWorkday(new Date(2026, 5, 16, 12))).toBe(true)
    expect(isWorkday(new Date(2026, 5, 17, 12))).toBe(false)
  })

  it('moves a requested holiday to the next workday', () => {
    expect(getDefaultDate('2026-06-17')).toBe('2026-06-18')
  })
})
