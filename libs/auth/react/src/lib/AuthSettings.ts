import { UserManagerSettings, WebStorageStateStore } from 'oidc-client-ts'
import { storageFactory } from './storageFactory'

export interface AuthSettings extends Omit<UserManagerSettings, 'scope'> {
  /*
   * Used to create redirect uris. Should not end with slash.
   * Default: window.location.origin
   */
  baseUrl?: string

  /*
   * Used to bind React Router callback route and to build a default value for `redirect_uri` with baseUrl. Should be
   * relative from baseUrl and start with a "/".
   * Default: "/auth/callback"
   */
  redirectPath?: string

  /**
   * Used to bind React Router callback route and to build a default value for `silent_redirect_uri` with baseUrl.
   * Should be relative from baseUrl and start with a "/".
   * Default: "/auth/callback-silent"
   */
  redirectPathSilent?: string

  /**
   * Prefix for storing user access tokens in session storage.
   */
  userStorePrefix?: string

  /**
   * Allow to pass the scope as an array.
   */
  scope?: string[]

  /**
   * Which URL to send the user to after switching users.
   */
  switchUserRedirectUrl?: string

  /**
   * Wich PATH on the AUTHORITY to use for checking the session expiry.
   */
  checkSessionPath?: string
}

export const mergeAuthSettings = (settings: AuthSettings): AuthSettings => {
  const baseUrl = settings.baseUrl ?? window.location.origin
  const redirectPath = settings.redirectPath ?? '/auth/callback'
  const redirectPathSilent =
    settings.redirectPathSilent ?? '/auth/callback-silent'

  // Many Open ID Connect features only work when on the same domain as the IDS (with first party cookies)
  const onIdsDomain = /(is|dev)land.is$/.test(window.location.origin)

  return {
    baseUrl,
    redirectPath,
    redirectPathSilent,
    checkSessionPath: '/connect/sessioninfo',
    silent_redirect_uri: `${baseUrl}${redirectPathSilent}`,
    post_logout_redirect_uri: baseUrl,
    response_type: 'code',
    revokeTokenTypes: ['access_token', 'refresh_token'],
    revokeTokensOnSignout: true,
    loadUserInfo: true,
    monitorSession: onIdsDomain,
    userStore: new WebStorageStateStore({
      store: storageFactory(() => sessionStorage),
      prefix: settings.userStorePrefix,
    }),
    mergeClaims: true,
    ...settings,
    redirect_uri: settings.redirect_uri || `${baseUrl}${redirectPath}`,
  }
}
