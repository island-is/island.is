import { AUTH_URL } from '../auth/utils'

export const logout = () =>
  fetch(`${AUTH_URL}/logout`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

export const confirmRecycle = (returnUrl) =>
  fetch(`${AUTH_URL}?returnUrl=${returnUrl}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
