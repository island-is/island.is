import { User } from 'oidc-client'

export const fetchWithAuth = (url: string, userInfo: User) =>
  fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${userInfo.access_token}`,
    },
  })
