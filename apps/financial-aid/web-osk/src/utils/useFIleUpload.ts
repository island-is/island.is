import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@apollo/client'
import { UploadFile } from '@island.is/island-ui/core'
import { CreateSignedUrlMutation } from '@island.is/financial-aid-web/oskgraphql/sharedGql'
import { SignedUrl } from '@island.is/financial-aid/shared'

export const useFileUpload = () => {
  const [files, _setFiles] = useState<UploadFile[]>([])
  const filesRef = useRef<UploadFile[]>(files)

  const [createSignedUrlMutation] = useMutation(CreateSignedUrlMutation)

  // Utils
  /**
   * Sets ref and state value
   * @param files Files to set to state.
   */
  const setFiles = (files: UploadFile[]) => {
    filesRef.current = files
    _setFiles(files)
  }

  const onChange = (newFiles: File[], isRetry?: boolean) => {
    const newUploadFiles = newFiles as UploadFile[]

    if (!isRetry) {
      setFiles([...newUploadFiles, ...files])
    }

    newUploadFiles.forEach(async (file) => {
      const signedUrl = await createSignedUrl(file.name)

      if (signedUrl) {
        file.key = signedUrl.key

        updateFile(file)

        uploadToCloudFront(file, signedUrl.url)
      }
    })
  }

  const createSignedUrl = async (filename: string): Promise<SignedUrl> => {
    const validFileName = filename.replace(/ +/g, '_');
    
    const { data: presignedUrlData } = await createSignedUrlMutation({
      variables: { input: { fileName: validFileName } },
    })

    return presignedUrlData?.getSignedUrl
  }

  const uploadToCloudFront = (file: UploadFile, url: string) => {
    const request = new XMLHttpRequest()
    request.withCredentials = true
    request.responseType = 'json'

    request.upload.addEventListener('progress', (evt) => {
      if (evt.lengthComputable) {
        file.percent = (evt.loaded / evt.total) * 100
        file.status = 'uploading'

        updateFile(file)
      }
    })

    request.upload.addEventListener('error', (evt) => {
      if (evt.lengthComputable) {
        file.percent = 0
        file.status = 'error'

        updateFile(file)
      }
    })

    request.addEventListener('load', () => {
      if (request.status >= 200 && request.status < 300) {
        //   addFileToCase(file)
        file.status = 'done'
      } else {
        file.status = 'error'
        file.percent = 0
    }
    updateFile(file)
    })

    request.open('PUT', url)

    const formData = new FormData()

    formData.append('file', file as File)

    request.send(formData)
  }

  /**
   * Updates a file if it's in files and adds it to the end of files if not.
   * @param file The file to update.
   */
  const updateFile = (file: UploadFile) => {
    /**
     * Use the filesRef value instead of the files state value because
     *
     * 1. The process to update state is asynchronous therfore we can't trust
     * that we always have the correct state in this function.
     * 2. We are updating state in the event handlers in the uploadToS3 function
     * and the listener belongs to the initial render and is not updated on
     * subsequent rerenders.
     * (source: https://medium.com/geographit/accessing-react-state-in-event-listeners-with-usestate-and-useref-hooks-8cceee73c559)
     */
    const newFiles = [...filesRef.current]

    const updatedFiles = newFiles.map((newFile) => {
      return newFile.key === file.key ? file : newFile
    })

    setFiles(updatedFiles)
  }

  const addFileToApplication = (file: UploadFile) => {}

  return { files, onChange }
}
