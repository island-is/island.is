import { MOCK_AUTH_KEY } from '@island.is/service-portal/constants'
import Cookies from 'js-cookie'

const sleep = (ms = 0) => {
  return new Promise((r) => setTimeout(r, ms))
}

interface MockToken {
  token: ''
}

export default sleep

export const isAuthenticated = () => Cookies.get(MOCK_AUTH_KEY)?.length > 0

export const fetchToken = async (): Promise<MockToken> => {
  const nationalId = '2606862759'
  const token = await fetch('/user/token', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nationalId),
  })
  const expirationTime = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
  const retToken = token.json()
  Cookies.set(MOCK_AUTH_KEY, retToken, {
    sameSite: 'lax',
    expires: expirationTime,
  })
  return retToken
}

export const removeToken = async () => {
  Cookies.remove(MOCK_AUTH_KEY)
}
