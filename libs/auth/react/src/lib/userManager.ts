import { User, UserManager } from 'oidc-client'
import { AuthSettings, mergeAuthSettings } from './AuthSettings'

let authSettings: AuthSettings | null = null
let userManager: UserManager | null = null

export const getUserManager = (): UserManager => {
  if (userManager === null) {
    throw new Error('Tried to access user manager before calling configure')
  }
  return userManager
}

export const getAuthSettings = (): AuthSettings => {
  if (authSettings === null) {
    throw new Error('Tried to access auth settings before calling configure')
  }
  return authSettings
}

export const configure = (settings: AuthSettings) => {
  authSettings = mergeAuthSettings(settings)
  userManager = new UserManager(authSettings)
  return userManager
}

interface MockUser extends Partial<Omit<User, 'profile'>> {
  profile: Partial<User['profile']>
}

export const configureMock = (user?: MockUser) => {
  authSettings = mergeAuthSettings({
    client_id: 'test-client',
  })
  const userInfo: MockUser = {
    profile: { name: 'Mock', locale: 'is', nationalId: '0000000000' },
    expired: false,
    expires_in: 9999,
    ...user,
  }
  const empty = () => {
    /* intentionally empty */
  }

  userManager = ({
    getUser() {
      return Promise.resolve(userInfo as User)
    },
    signinSilent(): Promise<User> {
      return Promise.resolve(userInfo as User)
    },
    signinRedirect: empty,
    events: {
      addUserSignedOut: empty,
      addUserLoaded: empty,
      removeUserLoaded: empty,
      removeUserSignedOut: empty,
    },
  } as unknown) as UserManager
}

export { User, UserManager }
