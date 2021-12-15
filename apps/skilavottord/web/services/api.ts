import getConfig from 'next/config'

const {
  publicRuntimeConfig: { apiUrl },
} = getConfig()

export const logout = () =>
  fetch(`${apiUrl}/auth/logout`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
