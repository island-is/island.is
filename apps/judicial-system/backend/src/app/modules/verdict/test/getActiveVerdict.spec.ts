import { getActiveVerdict } from '../getActiveVerdict'

describe('getActiveVerdict', () => {
  const older = {
    id: 'older',
    isActive: false,
    created: new Date('2026-01-01'),
  }
  const newerActive = {
    id: 'newer',
    isActive: true,
    created: new Date('2026-06-01'),
  }

  it('returns the active verdict when present', () => {
    expect(getActiveVerdict([older, newerActive])).toEqual(newerActive)
  })

  it('falls back to the newest by created when none are marked active', () => {
    expect(
      getActiveVerdict([
        older,
        { ...newerActive, isActive: false, id: 'newest-inactive' },
      ]),
    ).toEqual(
      expect.objectContaining({
        id: 'newest-inactive',
      }),
    )
  })

  it('returns undefined for an empty list', () => {
    expect(getActiveVerdict([])).toBeUndefined()
    expect(getActiveVerdict(undefined)).toBeUndefined()
  })
})
