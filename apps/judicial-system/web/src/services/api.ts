import 'isomorphic-fetch'

import { deleteCookie } from '@island.is/judicial-system-web/src/utils/cookies'

const { API_URL = '' } = process.env // eslint-disable-line @typescript-eslint/naming-convention
export const apiUrl = API_URL

export const logOut = () => {
  deleteCookie('judicial-system.csrf')

  // No need to wait for the call
  fetch('/api/auth/logout')
}

export const getFeature = async (name: string): Promise<boolean> => {
  return await (await fetch(`/api/feature/${name}`)).json()
}
