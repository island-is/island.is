import { getApiKeyState } from './apiKeys'

describe('getApiKeyState', () => {
  const now = new Date('2026-11-05T12:00:00Z')

  it('returns revoked when the key has been revoked', () => {
    expect(
      getApiKeyState({ revokedAt: '2026-10-28', expiresAt: '2027-10-28' }, now),
    ).toBe('revoked')
  })

  it('returns expired when the expiry date has passed', () => {
    expect(
      getApiKeyState({ revokedAt: null, expiresAt: '2026-11-01' }, now),
    ).toBe('expired')
  })

  it('returns active when the key is not revoked and not expired', () => {
    expect(
      getApiKeyState({ revokedAt: null, expiresAt: '2027-10-28' }, now),
    ).toBe('active')
  })

  it('returns active when the key has no expiry date', () => {
    expect(getApiKeyState({ revokedAt: null, expiresAt: null }, now)).toBe(
      'active',
    )
  })
})
