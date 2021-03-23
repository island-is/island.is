import get from 'lodash/get'
import {
  UserManager,
  UserManagerSettings,
  WebStorageStateStore,
  User,
} from 'oidc-client'

import { environment } from '../environments'

export const settings: UserManagerSettings = {
  authority: environment.identityServer.authority,
  client_id: 'island-is-1',
  silent_redirect_uri: `${window.location.origin}/umsoknir/silent/signin-oidc`,
  redirect_uri: `${window.location.origin}/umsoknir/signin-oidc`,
  post_logout_redirect_uri: `${window.location.origin}`,
  response_type: 'code',
  revokeAccessTokenOnSignout: true,
  loadUserInfo: true,
  automaticSilentRenew: true,
  scope: 'openid profile api_resource.scope',
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
}

const userTokenIsValid = (user: User) => {
  const expiresAtSeconds = get(user, 'expires_at', null)

  if (expiresAtSeconds === null) {
    return false
  } else if (typeof expiresAtSeconds !== 'number') {
    return false
  }

  const msWhenExpired = expiresAtSeconds * 1000
  const msNow = Date.now()

  return msWhenExpired > msNow
}

export class ExtendedUserManager extends UserManager {
  constructor(settings: UserManagerSettings) {
    super(settings)
  }

  async verifyAuthentication() {
    let user = await this.getUser()

    try {
      if (user === null || !userTokenIsValid(user)) {
        user = await this.signinSilent()
      }
    } catch {
      throw new Error('Unauthorized')
    }

    return user
  }
}

export const userManager = new ExtendedUserManager(settings)
