import { authApi } from './auth-api'

describe('authApi', () => {
  it('should work', () => {
    expect(authApi()).toEqual('auth-api')
  })
})
