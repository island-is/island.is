import { deleteCookie } from '@island.is/judicial-system-web/src/utils/cookies'

import 'isomorphic-fetch'

const { API_URL = '' } = process.env // eslint-disable-line @typescript-eslint/naming-convention
export const apiUrl = API_URL

export const logout = () => {
  deleteCookie('judicial-system.csrf')
  window.location.href = `${apiUrl}/api/auth/logout`
}

export const getFeature = async (name: string): Promise<boolean> => {
  return await (await fetch(`/api/feature/${name}`)).json()
}
