import Cookie from 'js-cookie'

import { CSRF_COOKIE_NAME } from '@island.is/judicial-system/consts'
import { deleteCookie } from '@island.is/judicial-system-web/src/utils/cookies'

import 'isomorphic-fetch'

const { API_URL = '' } = process.env // eslint-disable-line @typescript-eslint/naming-convention
export const apiUrl = API_URL

export const logout = () => {
  deleteCookie(CSRF_COOKIE_NAME)
  window.location.assign(`${apiUrl}/api/auth/logout`)
}

export const activate = async (userId: string) => {
  const token = Cookie.get(CSRF_COOKIE_NAME)
  const options = token ? { headers: { authorization: `Bearer ${token}` } } : {}

  const res = await fetch(`/api/auth/activate/${userId}`, options)

  if (res.ok) {
    window.location.assign(res.url)
  }
}

export const getFeature = async (name: string): Promise<boolean> => {
  return await (await fetch(`/api/feature/${name}`)).json()
}

// TEMP: Initial implementation to trigger token refresh manually in the client.
// Ideally it should be handled in a middleware like BFF
export const prepareRequest = async () => {
  const token = Cookie.get(CSRF_COOKIE_NAME)
  const options = token ? { headers: { authorization: `Bearer ${token}` } } : {}

  // check if tokens stored in the session cookie are expired
  // and if expired auth api handles the refresh
  const res = await fetch(`/api/auth/token-refresh`, options)
  return { success: res.ok }
}
