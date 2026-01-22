import { PresignedPost } from '@island.is/api/schema'
import { FileUploadStatus, UploadFile } from '@island.is/island-ui/core'
import { useState } from 'react'

export const useFileUpload = () => {
  const [activeFile, setActiveFile] = useState<UploadFile>()

  const uploadFile = async (file: UploadFile, response: PresignedPost) => {
    if (!file.originalFileObj) {
      console.error('No originalFileObj found on file:', file)
      return Promise.reject('No file object found')
    }

    return new Promise((resolve, reject) => {
      const request = new XMLHttpRequest()
      request.withCredentials = true
      request.responseType = 'json'

      request.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          file.percent = (event.loaded / event.total) * 100
          file.status = FileUploadStatus.uploading

          setActiveFile(file)
        }
      })

      request.upload.addEventListener('error', () => {
        file.percent = 0

        setActiveFile(file)
        reject()
      })
      request.open('POST', response.url)

      const formData = new FormData()

      Object.keys(response.fields).forEach((key) =>
        formData.append(key, response.fields[key]),
      )

      formData.append('file', file.originalFileObj as File)

      request.setRequestHeader('x-amz-acl', 'bucket-owner-full-control')

      request.onload = () => {
        resolve(request.response)
      }

      request.onerror = () => {
        reject()
      }
      request.send(formData)
    })
  }

  return {
    uploadFile,
    setActiveFile,
    activeFile,
  }
}
