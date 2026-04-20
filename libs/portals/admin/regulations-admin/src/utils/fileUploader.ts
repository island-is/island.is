import { EditorFileUploader } from '@dmr.is/regulations-tools/Editor'
import { RegulationDraftId } from '@island.is/regulations/admin'
import { fileUrl, useS3Upload } from './dataHooks'

export function useFileUploader(draftId: RegulationDraftId) {
  const { createPresignedPost, createFormData } = useS3Upload()

  const fileUploader =
    (): EditorFileUploader => async (blobInfo, success, failure, progress) => {
      try {
        const presignedPost = await createPresignedPost(
          blobInfo.filename(),
          draftId,
        )

        if (!presignedPost) {
          throw new Error('Failed to create presigned post')
        }

        const blob = blobInfo.blob()

        const request = new XMLHttpRequest()
        request.withCredentials = true
        request.responseType = 'json'

        request.upload.addEventListener('progress', (evt) => {
          if (evt.lengthComputable) {
            progress && progress((evt.loaded / evt.total) * 100)
          }
        })

        request.upload.addEventListener('error', () => {
          failure(`Upload errored out. ${request.statusText}`)
        })

        request.addEventListener('load', () => {
          if (request.status >= 200 && request.status < 300 && presignedPost) {
            success(`${fileUrl}/${presignedPost?.fields?.['key']}`)
          } else {
            failure(`Upload failed. ${request.statusText}`)
          }
        })

        // Create FormData and send the request
        const formData = createFormData(presignedPost, blob as File)
        request.open('POST', presignedPost?.url, true)
        request.send(formData)
      } catch (error) {
        console.error('Error during upload:', error)
        failure('Failed to upload file. Please try again.')
      }
    }
  return fileUploader
}
