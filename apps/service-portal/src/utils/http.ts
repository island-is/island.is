import { UserWithMeta } from '@island.is/service-portal/core'

export const fetchWithAuth = (url: string, userInfo: UserWithMeta) =>
  fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${userInfo.user.access_token}`,
    },
  })
