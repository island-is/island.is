import { MOCK_AUTH_KEY } from '@island.is/service-portal/constants'
import Cookies from 'js-cookie'
import { UserManager } from 'oidc-client'

export const sleep = (ms = 0) => {
  return new Promise((r) => setTimeout(r, ms))
}

interface MockToken {
  token: ''
}

export const isAuthenticated = (userManager: UserManager) => {

  const isLoggedIn = async () => {
    console.log('authnehtisndf')
    const user = await userManager.getUser()
    console.log('is logged in '+ !!user)
    return !!user
  }

  return isLoggedIn()
}

export const setUserToken = async (
  actorNationalId,
  subjectNationalId,
): Promise<MockToken> => {
  const token = await fetch('/user/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      actorNationalId,
      subjectNationalId,
    }),
  })
  const expirationTime = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
  const retToken = await token.json()

  Cookies.set(MOCK_AUTH_KEY, retToken.token, {
    sameSite: 'lax',
    expires: expirationTime,
  })

  return retToken
}

export const removeToken = async () => {
  Cookies.remove(MOCK_AUTH_KEY)
}
