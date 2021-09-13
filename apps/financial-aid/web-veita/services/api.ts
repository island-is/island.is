import 'isomorphic-fetch'

import { deleteCookie } from '@island.is/financial-aid/shared/lib'

const { API_URL = '' } = process.env // eslint-disable-line @typescript-eslint/naming-convention
export const apiUrl = API_URL

export const logOut = (path = '') => {
  if (window.location.pathname !== '/') {
    // We don't need to wait for the call
    fetch('/api/auth/logout')

    deleteCookie('financial-aid.csrf')

    window.location.assign(`/${path}`)
  }
}

export const getFeature = async (name: string): Promise<boolean> => {
  return await (await fetch(`/api/feature/${name}`)).json()
}
