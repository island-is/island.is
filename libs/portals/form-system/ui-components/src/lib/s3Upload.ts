import { PresignedPost } from '@island.is/api/schema'
import { UploadFile } from '@island.is/island-ui/core'

const createFormData = (
  presignedPost: PresignedPost,
  file: UploadFile,
): FormData => {
  const formData = new FormData()
  Object.keys(presignedPost.fields).forEach((key) => {
    if (key !== 'bucket') {
      formData.append(key, presignedPost.fields[key])
    }
  })
  if (file.originalFileObj) {
    formData.append('file', file.originalFileObj)
  }
  return formData
}

export const uploadToS3 = async (
  presignedPost: PresignedPost,
  file: UploadFile,
  onProgress: (percent: number) => void,
) => {
  const promise = new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.withCredentials = true
    request.responseType = 'json'

    request.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        onProgress((event.loaded / event.total) * 100)
      }
    })

    request.upload.addEventListener('error', (event) => {
      if (event.lengthComputable) {
        reject('Failed to upload file to S3')
      }
    })

    request.addEventListener('load', () => {
      if (request.status >= 200 && request.status < 300) {
        resolve(file)
      } else {
        reject('Failed to upload file to S3')
      }
    })

    request.open('POST', presignedPost.url)
    request.send(createFormData(presignedPost, file))
  })

  return promise
}
