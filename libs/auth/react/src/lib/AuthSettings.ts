import { UserManagerSettings, WebStorageStateStore } from 'oidc-client'

export interface AuthSettings extends UserManagerSettings {
  /**
   * Make client id required.
   */
  client_id: string

  /*
   * Used to create redirect uris. Should not end with slash.
   * Default: window.location.origin
   */
  baseUrl?: string

  /**
   * Base path
   * Default: Path from baseUrl.
   */
  basePath?: string

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
}

export const mergeAuthSettings = (settings: AuthSettings) => {
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
    authority: 'https://innskra.island.is',
    silent_redirect_uri: `${baseUrl}${redirectPathSilent}`,
    redirect_uri: `${baseUrl}${redirectPath}`,
    post_logout_redirect_uri: `${baseUrl}`,
    response_type: 'code',
    revokeAccessTokenOnSignout: true,
    loadUserInfo: true,
    monitorSession: onIdsDomain,
    userStore: new WebStorageStateStore({
      store: window.sessionStorage,
      prefix: settings.userStorePrefix,
    }),
    ...settings,
  }
}
