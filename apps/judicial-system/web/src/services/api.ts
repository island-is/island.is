import 'isomorphic-fetch'

import { deleteCookie } from '../utils/cookies'

const { API_URL = '' } = process.env
export const apiUrl = API_URL

export const logOut = (path = '') => {
  if (window.location.pathname !== '/') {
    // We don't need to wait for the call
    fetch(`/api/auth/logout`)

    deleteCookie('judicial-system.csrf')

    window.location.assign(`/${path}`)
  }
}
