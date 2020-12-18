import { AUTH_URL } from '../auth/utils'
import { BASE_PATH } from '@island.is/skilavottord/consts'

export const logout = () =>
  fetch(`${BASE_PATH}${AUTH_URL['citizen']}/logout`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
