import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@apollo/client'
import { UploadFile } from '@island.is/island-ui/core'
import {
  CreateSignedUrlMutation,
  ApplicationFilesMutation,
} from '@island.is/financial-aid-web/osk/graphql/sharedGql'
import { FileType, SignedUrl } from '@island.is/financial-aid/shared/lib'

export const useFileUpload = (formFiles: UploadFile[]) => {
  const [files, _setFiles] = useState<UploadFile[]>([])
  const filesRef = useRef<UploadFile[]>(files)
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string>()
  const [createSignedUrlMutation] = useMutation(CreateSignedUrlMutation)
  const [createApplicationFiles] = useMutation(ApplicationFilesMutation)

  const requests: { [Key: string]: XMLHttpRequest } = {}

  useEffect(() => {
    if (files && formFiles && files.length < formFiles.length) {
      setFiles(formFiles)
    }
  }, [formFiles])

  // Utils
  /**
   * Sets ref and state value
   * @param files Files to set to state.
   */
  const setFiles = (files: UploadFile[]) => {
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
    filesRef.current = files
    _setFiles(files)
  }

  const onChange = (newFiles: File[], isRetry?: boolean) => {
    setUploadErrorMessage(undefined)

    const newUploadFiles = newFiles as UploadFile[]

    if (!isRetry) {
      setFiles([...newUploadFiles, ...files])
    }

    newUploadFiles.forEach(async (file) => {
      const signedUrl = await createSignedUrl(file.name.normalize())

      if (signedUrl) {
        file.key = signedUrl.key

        updateFile(file)

        uploadToCloudFront(file, signedUrl.url)
      } else {
        file.status = 'error'

        updateFile(file)
      }
    })
  }

  const createSignedUrl = async (
    filename: string,
  ): Promise<SignedUrl | undefined> => {
    const validEncodedFileName = encodeURI(filename.replace(/ +/g, '_'))

    let signedUrl: SignedUrl | undefined = undefined

    try {
      const { data: presignedUrlData } = await createSignedUrlMutation({
        variables: { input: { fileName: validEncodedFileName } },
      })

      signedUrl = presignedUrlData?.getSignedUrl
    } catch (e) {
      setUploadErrorMessage('Næ ekki sambandi við vefþjón')
    }

    return signedUrl
  }

  const formatFiles = async (
    allFiles: UploadFile[],
    applicationId: string,
    type: FileType,
  ) => {
    const formatFiles = allFiles.map((f) => {
      return {
        applicationId: applicationId,
        name: f.name ?? '',
        key: f.key ?? '',
        size: f.size ?? 0,
        type: type,
      }
    })
    return formatFiles
  }

  const uploadStateFiles = async (applicationId: string, type: FileType) => {
    try {
      return await createApplicationFiles({
        variables: {
          input: { files: formatFiles(files, applicationId, type) },
        },
      })
    } catch (e) {
      throw e
    }
  }

  const uploadFiles = async (
    applicationId: string,
    type: FileType,
    uploadFile: UploadFile[],
  ) => {
    try {
      return await createApplicationFiles({
        variables: {
          input: { files: formatFiles(uploadFile, applicationId, type) },
        },
      })
    } catch (e) {
      throw e
    }
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
      file.percent = 0
      file.status = 'error'
      setUploadErrorMessage('Næ ekki að hlaða upp')

      if (file.key) {
        delete requests[file.key]
      }

      if (evt.lengthComputable) {
        updateFile(file)
      }
    })

    request.addEventListener('load', () => {
      if (file.key) {
        delete requests[file.key]
      }

      if (request.status >= 200 && request.status < 300) {
        file.status = 'done'
      } else {
        file.status = 'error'
        file.percent = 0
        setUploadErrorMessage('Næ ekki að hlaða upp')
      }
      updateFile(file)
    })

    request.open('PUT', url)

    const formData = new FormData()

    formData.append('file', file as File)
    request.setRequestHeader('x-amz-acl', 'bucket-owner-full-control')

    formData.forEach((el) => {
      request.send(el)
    })
  }

  const updateFile = (file: UploadFile) => {
    const newFiles = [...filesRef.current]
    const updatedFiles = newFiles.map((newFile) => {
      return newFile.key === file.key ? file : newFile
    })
    setFiles(updatedFiles)
  }

  const deleteUrl = async (url: string) => {
    try {
      await fetch(url, { method: 'DELETE' })
    } catch (e) {
      setUploadErrorMessage('Næ ekki að eyða skrá')
    }
  }

  const onRemove = async (file: UploadFile) => {
    setUploadErrorMessage(undefined)

    if (file.key && file.key in requests) {
      requests[file.key].abort()
      delete requests[file.key]
    }

    const signedUrl = await createSignedUrl(file.name)

    if (!signedUrl) {
      return
    }

    deleteUrl(signedUrl.url)

    setFiles([...files].filter((f) => f !== file))
  }

  const onRetry = (file: UploadFile) => {
    setUploadErrorMessage(undefined)
    onChange([file as File], true)
  }

  return {
    files,
    uploadErrorMessage,
    onChange,
    onRemove,
    onRetry,
    uploadFiles,
    uploadStateFiles,
  }
}
