import { BffUser } from '@island.is/shared/types'
import { LoggedInState } from './bff.state'

export const createMockedInitialState = (
  user?: Partial<BffUser>,
): LoggedInState => ({
  userInfo: {
    profile: {
      name: 'Mock',
      locale: 'is',
      nationalId: '0000000000',
      ...user?.profile,
    } as BffUser['profile'],
    scopes: user?.scopes ?? [],
  },
  authState: 'logged-in',
  isAuthenticated: true,
  error: null,
  authority: 'https://identity-server.dev01.devland.is',
})
