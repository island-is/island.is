import { MOCK_AUTH_KEY } from '@island.is/service-portal/constants'

const sleep = (ms = 0) => {
  return new Promise((r) => setTimeout(r, ms))
}

interface MockToken {
  token: ''
}

export default sleep

export const isAuthenticated = () => localStorage[MOCK_AUTH_KEY]?.length > 0

export const fetchToken = async (): Promise<MockToken> => {
  const nationalId = '2606862759'
  const token = await fetch('/user/token', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nationalId),
  })
  return token.json()
}

export const removeToken = async () => {
  localStorage[MOCK_AUTH_KEY] = false
}
