import { deleteCookie } from '@island.is/judicial-system-web/src/utils/cookies'

import { User, UserRole } from '../graphql/schema'

import 'isomorphic-fetch'

const { API_URL = '' } = process.env // eslint-disable-line @typescript-eslint/naming-convention
export const apiUrl = API_URL

export const logout = () => {
  deleteCookie('judicial-system.csrf')
  window.location.href = `${apiUrl}/api/auth/logout`
}

export const login = async () => {
  await fetch(`/api/auth/log-login`, {
    method: 'POST',
    body: JSON.stringify({
      nationalId: '1112902539',
      role: UserRole.DEFENDER,
    } as User),
  })
  // window.location.href = `${apiUrl}/api/auth/login`
}

export const getFeature = async (name: string): Promise<boolean> => {
  return await (await fetch(`/api/feature/${name}`)).json()
}
