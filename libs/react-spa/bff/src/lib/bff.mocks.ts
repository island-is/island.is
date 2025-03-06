import { BffUser } from '@island.is/shared/types'
import { LoggedInState } from './bff.state'

export const createMockedInitialState = (
  user?: Partial<BffUser>,
  issuer = 'https://innskra.dev01.devland.is',
): LoggedInState => ({
  userInfo: {
    profile: {
      name: 'Mock',
      locale: 'is',
      nationalId: '0000000000',
      ...user?.profile,
      iss: issuer,
    } as BffUser['profile'],
    scopes: user?.scopes ?? [],
  },
  authState: 'logged-in',
  isAuthenticated: true,
  error: null,
})
