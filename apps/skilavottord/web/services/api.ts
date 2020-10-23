import { AUTH_URL } from '../auth/utils'

export const logout = (permissionType) =>
  fetch(`${AUTH_URL[permissionType]}/logout`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
