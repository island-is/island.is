import {
  UserManager,
  WebStorageStateStore,
  InMemoryWebStorage,
  UserManagerSettings,
} from 'oidc-client'

const settings: UserManagerSettings = {
  authority: 'https://siidentityserverweb20200805020732.azurewebsites.net/',
  // eslint-disable-next-line @typescript-eslint/camelcase
  client_id: 'island-is-1',
  // eslint-disable-next-line @typescript-eslint/camelcase
  silent_redirect_uri: `${process.env.NX_SERVICE_PORTAL_BASE_URL ?? 'http://localhost:4200'}/silent/signin-oidc`,
  // eslint-disable-next-line @typescript-eslint/camelcase
  redirect_uri: `${process.env.NX_SERVICE_PORTAL_BASE_URL ?? 'http://localhost:4200'}/signin-oidc`,
  // eslint-disable-next-line @typescript-eslint/camelcase
  response_type: 'code',
  revokeAccessTokenOnSignout: true,
  loadUserInfo: true,
  automaticSilentRenew: true,
  scope: 'openid profile offline_access',
  userStore: new WebStorageStateStore({ store: new InMemoryWebStorage() }),
}

export const userManager = new UserManager(settings)
