import { User, UserManager } from 'oidc-client-ts'

import { AuthSettings, mergeAuthSettings } from './AuthSettings'
import { toStringScope } from './utils/toStringScope'
import { createMockUser, MockUser } from './createMockUser'

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

  userManager = new UserManager({
    ...authSettings,
    scope: toStringScope(settings.scope),
    redirect_uri: `${authSettings.baseUrl}${authSettings.redirectPath}`,
  })

  return userManager
}

export const configureMock = (user?: MockUser) => {
  authSettings = mergeAuthSettings({
    client_id: 'test-client',
    authority: 'https://innskra.island.is',
  })

  const userInfo = createMockUser(user)
  const empty = () => {
    /* intentionally empty */
  }

  userManager = {
    getUser(): Promise<User> {
      return Promise.resolve(userInfo)
    },
    signinSilent(): Promise<User> {
      return Promise.resolve(userInfo)
    },
    signinRedirect: empty,
    events: {
      addUserSignedOut: empty,
      addUserLoaded: empty,
      removeUserLoaded: empty,
      removeUserSignedOut: empty,
    },
  } as unknown as UserManager
}

export { User, UserManager }
