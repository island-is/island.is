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
    request.timeout = 5 * 60 * 1000

    request.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        onProgress((event.loaded / event.total) * 100)
      }
    })

    const rejectUpload = () => reject(new Error('Failed to upload file to S3'))
    request.addEventListener('error', rejectUpload)
    request.addEventListener('abort', rejectUpload)
    request.addEventListener('timeout', rejectUpload)

    request.addEventListener('load', () => {
      if (request.status >= 200 && request.status < 300) {
        resolve(file)
      } else {
        rejectUpload()
      }
    })

    request.open('POST', presignedPost.url)
    request.send(createFormData(presignedPost, file))
  })

  return promise
}
