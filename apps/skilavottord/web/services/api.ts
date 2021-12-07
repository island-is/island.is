import getConfig from 'next/config'

const { serverRuntimeConfig } = getConfig()
const { apiUrl } = serverRuntimeConfig

export const logout = () =>
  fetch(`${apiUrl}/auth/logout`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
