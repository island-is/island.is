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

  it('returns undefined when multiple verdicts are present but none are active', () => {
    expect(
      getActiveVerdict([
        older,
        { ...newerActive, isActive: false, id: 'newest-inactive' },
      ]),
    ).toBeUndefined()
  })

  it('returns the sole verdict when isActive is not present on attributes', () => {
    expect(getActiveVerdict([{ id: 'only' }])).toEqual({ id: 'only' })
  })

  it('returns undefined for a sole explicitly inactive verdict', () => {
    expect(getActiveVerdict([older])).toBeUndefined()
  })

  it('returns undefined for an empty list', () => {
    expect(getActiveVerdict([])).toBeUndefined()
    expect(getActiveVerdict(undefined)).toBeUndefined()
  })
})
