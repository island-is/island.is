import { formatValidUntil } from './dates'

describe('formatValidUntil', () => {
  // The shape DMR actually sends for legacy coverage: the last instant of the
  // day, in UTC. Read in local time east of UTC this would come out as 1.4.2028.
  it('formats an ISO instant in UTC', () => {
    expect(formatValidUntil('2028-03-31T23:59:59.000Z')).toBe('31.3.2028')
  })

  it('formats a date-only value', () => {
    expect(formatValidUntil('2028-03-31')).toBe('31.3.2028')
  })

  // Null rather than the raw string: the caller renders it after a "Gildir til"
  // label, where an unparseable value would read as a date.
  it('returns null for an unparseable value', () => {
    expect(formatValidUntil('einhvern tímann')).toBeNull()
  })

  it.each([undefined, null, ''])('returns null for %p', (value) => {
    expect(formatValidUntil(value)).toBeNull()
  })
})
