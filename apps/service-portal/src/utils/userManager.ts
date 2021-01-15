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
  // eslint-disable-next-line @typescript-eslint/camelcase
  client_id: 'island-is-1',
  // eslint-disable-next-line @typescript-eslint/camelcase
  silent_redirect_uri: `${window.location.origin}/silent/signin-oidc`,
  // eslint-disable-next-line @typescript-eslint/camelcase
  redirect_uri: `${window.location.origin}/signin-oidc`,
  // eslint-disable-next-line @typescript-eslint/camelcase
  post_logout_redirect_uri: `${window.location.origin}`,
  // eslint-disable-next-line @typescript-eslint/camelcase
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
