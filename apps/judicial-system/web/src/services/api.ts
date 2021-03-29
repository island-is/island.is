import 'isomorphic-fetch'

import { deleteCookie } from '@island.is/judicial-system-web/src/utils/cookies'
import { PresignedPost } from '@island.is/judicial-system/types'
import { UploadFile } from '@island.is/island-ui/core'

const { API_URL = '' } = process.env
export const apiUrl = API_URL

export const logOut = (path = '') => {
  if (window.location.pathname !== '/') {
    // We don't need to wait for the call
    fetch('/api/auth/logout')

    deleteCookie('judicial-system.csrf')

    window.location.assign(`/${path}`)
  }
}

export const getFeature = async (name: string) => {
  return await (await fetch(`/api/feature/${name}`)).json()
}

export const createUploadFile = (
  presignedPost: PresignedPost,
  file: UploadFile,
) => {
  const formData = new FormData()
  Object.keys(presignedPost.fields).forEach((key) =>
    formData.append(key, presignedPost.fields[key]),
  )
  formData.append('file', file as File)

  return formData
}
