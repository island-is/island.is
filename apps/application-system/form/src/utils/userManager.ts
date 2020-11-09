import {
  UserManager,
  WebStorageStateStore,
  UserManagerSettings,
} from 'oidc-client'
import { environment } from '../environments'

const settings: UserManagerSettings = {
  authority: environment.identityServer.baseUrl,
  // eslint-disable-next-line @typescript-eslint/camelcase
  client_id: 'island-is-1',
  // eslint-disable-next-line @typescript-eslint/camelcase
  silent_redirect_uri: `${window.location.origin}/silent/signin-oidc`,
  // eslint-disable-next-line @typescript-eslint/camelcase
  redirect_uri: `${window.location.origin}/signin-oidc`,
  // eslint-disable-next-line @typescript-eslint/camelcase
  response_type: 'code',
  revokeAccessTokenOnSignout: true,
  loadUserInfo: true,
  automaticSilentRenew: true,
  scope: 'openid profile offline_access api_resource.scope',
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
}

export const userManager = new UserManager(settings)
