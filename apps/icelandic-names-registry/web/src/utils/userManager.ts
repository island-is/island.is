import get from 'lodash/get'
import {
  UserManager,
  WebStorageStateStore,
  UserManagerSettings,
  User,
} from 'oidc-client'
import { environment } from '../environments'

const settings: UserManagerSettings = {
  authority: environment.identityServer.IDENTITY_SERVER_ISSUER_URL,
  client_id: 'island-is-1',
  silent_redirect_uri: `${window.location.origin}/minarsidur/silent/signin-oidc`,
  redirect_uri: `${window.location.origin}/minarsidur/signin-oidc`,
  post_logout_redirect_uri: `${window.location.origin}`,
  response_type: 'code',
  includeIdTokenInSilentRenew: true,
  revokeAccessTokenOnSignout: true,
  accessTokenExpiringNotificationTime: 30,
  loadUserInfo: true,
  automaticSilentRenew: true,
  scope:
    'openid profile api_resource.scope @island.is/applications:read @island.is/applications:write',
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
    const user = await this.getUser()
    try {
      if (user === null || !userTokenIsValid(user)) {
        this.signinRedirect()
      }
    } catch (e) {
      throw new Error('Unauthorized')
    }

    return user
  }
}

export const userManager = new ExtendedUserManager(settings)
