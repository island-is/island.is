import Cookies from 'js-cookie'
import { MOCK_AUTH_KEY } from '@island.is/service-portal/constants'

export const fetchWithAuth = (url: string) =>
  fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${Cookies.get(MOCK_AUTH_KEY)}`,
    },
  })
