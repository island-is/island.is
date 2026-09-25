import { sign } from 'jsonwebtoken'

import { checkExpiry } from './utils'

const token = (lifetimeSeconds: number, secondsUntilExpiry: number) => {
  const exp = Math.floor(Date.now() / 1000) + secondsUntilExpiry
  return sign({ iat: exp - lifetimeSeconds, exp }, 'secret')
}

describe('checkExpiry', () => {
  it('renews well before a long lived token expires', () => {
    expect(checkExpiry(token(3600, 240), false)).toBe(true)
  })

  it('does not renew a long lived token that was just issued', () => {
    expect(checkExpiry(token(3600, 3500), false)).toBe(false)
  })

  it('does not renew a short lived token on every request', () => {
    expect(checkExpiry(token(120, 100), false)).toBe(false)
    expect(checkExpiry(token(120, 30), false)).toBe(true)
  })

  it('stops renewing once the refresh token has expired', () => {
    expect(checkExpiry(token(3600, 240), true)).toBe(false)
  })
})
