import { parseDateSafely } from './utils'

describe('parseDateSafely', () => {
  it('parses a Rannis-format timestamp as UTC regardless of local TZ', () => {
    const date = parseDateSafely('2026-10-01 23:59:59')

    expect(date).toBeDefined()
    expect(date?.getUTCFullYear()).toBe(2026)
    expect(date?.getUTCMonth()).toBe(9)
    expect(date?.getUTCDate()).toBe(1)
    expect(date?.getUTCHours()).toBe(23)
    expect(date?.getUTCMinutes()).toBe(59)
    expect(date?.getUTCSeconds()).toBe(59)
  })

  it('returns undefined for an invalid date string', () => {
    expect(parseDateSafely('not-a-date')).toBeUndefined()
  })

  it('returns undefined for an empty string', () => {
    expect(parseDateSafely('')).toBeUndefined()
  })
})
