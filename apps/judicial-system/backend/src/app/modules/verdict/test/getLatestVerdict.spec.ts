import { getLatestVerdict } from '../getLatestVerdict'

describe('getLatestVerdict', () => {
  const older = { id: 'older', created: new Date('2026-01-01') }
  const newer = { id: 'newer', created: new Date('2026-06-01') }

  it('returns the newest verdict by created regardless of array order', () => {
    expect(getLatestVerdict([newer, older])).toEqual(newer)
    expect(getLatestVerdict([older, newer])).toEqual(newer)
  })

  it('returns undefined for empty or missing lists', () => {
    expect(getLatestVerdict([])).toBeUndefined()
    expect(getLatestVerdict(undefined)).toBeUndefined()
  })
})
