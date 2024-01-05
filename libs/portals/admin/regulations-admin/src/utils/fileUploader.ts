import { EditorFileUploader } from '@island.is/regulations-tools/Editor'
import { RegulationDraftId } from '@island.is/regulations/admin'
import { useS3Upload } from './dataHooks'

export function useFileUploader(draftId: RegulationDraftId) {
  const { createPresignedPost, createFormData } = useS3Upload()

  const fileUploader =
    (): EditorFileUploader => async (blobInfo, success, failure, progress) => {
      const presignedPost = await createPresignedPost(
        blobInfo.filename(),
        draftId,
      )

      const blob = blobInfo.blob()
      const formData = createFormData(presignedPost, blob as File)

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
        if (request.status >= 200 && request.status < 300) {
          success(`https://files.reglugerd.is/${presignedPost.fields['key']}`)
        } else {
          failure(`Upload failed. ${request.statusText}`)
        }
      })
      request.open('POST', presignedPost.url, true)
      request.send(formData)
    }
  return fileUploader
}
