import { useEffect, useRef, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import { useIntl } from 'react-intl'
import { useLazyQuery, useMutation } from '@apollo/client'
import { gql } from '@apollo/client'

import { UploadFileDeprecated } from '@island.is/island-ui/core'
import {
  CreateFilesResponse,
  FileType,
  SignedUrl,
} from '@island.is/financial-aid/shared/lib'
import { encodeFilenames } from '../utils'
import { FILE_SIZE_LIMIT } from '../constants'
import { filesText } from '../messages'

export const CreateSignedUrlMutation = gql`
  mutation CreateMunicipalitiesFinancialAidSignedUrlQuery(
    $input: MunicipalitiesFinancialAidCreateSignedUrlInput!
  ) {
    createMunicipalitiesFinancialAidSignedUrl(input: $input) {
      url
      key
    }
  }
`

const ApplicationFilesMutation = gql`
  mutation CreateMunicipalitiesFinancialAidFilesMutation(
    $input: MunicipalitiesFinancialAidApplicationFilesInput!
  ) {
    createMunicipalitiesFinancialAidApplicationFiles(input: $input) {
      success
      files {
        id
        key
        name
        size
      }
    }
  }
`

export const SignedUrlQuery = gql`
  query MunicipalitiesFinancialAidApplicationSignedUrlQuery(
    $input: MunicipalitiesFinancialAidGetSignedUrlInput!
  ) {
    municipalitiesFinancialAidApplicationSignedUrl(input: $input) {
      url
      key
    }
  }
`

export const useFileUpload = (
  formFiles: UploadFileDeprecated[],
  folderId: string,
) => {
  const { formatMessage } = useIntl()
  const [files, _setFiles] = useState<UploadFileDeprecated[]>([])
  const filesRef = useRef<UploadFileDeprecated[]>(files)
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string>()
  const [createSignedUrlMutation] = useMutation(CreateSignedUrlMutation)
  const [createApplicationFiles] = useMutation<{
    createMunicipalitiesFinancialAidApplicationFiles: CreateFilesResponse
  }>(ApplicationFilesMutation)

  const [openFile] = useLazyQuery(SignedUrlQuery, {
    fetchPolicy: 'no-cache',
    onCompleted: (data: {
      municipalitiesFinancialAidApplicationSignedUrl: SignedUrl
    }) => {
      window.open(
        data.municipalitiesFinancialAidApplicationSignedUrl.url,
        '_blank',
      )
    },
  })

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
  const setFiles = (files: UploadFileDeprecated[]) => {
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

  const onChange = (
    newFiles: UploadFileDeprecated[],
    uploadCount?: number,
    isRetry?: boolean,
  ) => {
    setUploadErrorMessage(undefined)

    if (!isRetry) {
      setFiles([...newFiles, ...files])
    }

    newFiles.forEach(async (file) => {
      const signedUrl = await createSignedUrl(file.name)

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
    let signedUrl: SignedUrl | undefined = undefined

    try {
      const { data: presignedUrlData } = await createSignedUrlMutation({
        variables: {
          input: {
            fileName: encodeFilenames(filename),
            folder: folderId,
          },
        },
      })

      signedUrl = presignedUrlData?.createMunicipalitiesFinancialAidSignedUrl
    } catch (e) {
      setUploadErrorMessage('Næ ekki sambandi við vefþjón')
    }

    return signedUrl
  }

  const formatFiles = (
    allFiles: UploadFileDeprecated[],
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
    return await createApplicationFiles({
      variables: {
        input: { files: formatFiles(files, applicationId, type) },
      },
    })
  }

  const uploadFiles = async (
    applicationId: string,
    type: FileType,
    uploadFile: UploadFileDeprecated[],
  ) => {
    return (
      await createApplicationFiles({
        variables: {
          input: { files: formatFiles(uploadFile, applicationId, type) },
        },
      })
    ).data?.createMunicipalitiesFinancialAidApplicationFiles?.files
  }

  const uploadToCloudFront = (file: UploadFileDeprecated, url: string) => {
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

  const updateFile = (file: UploadFileDeprecated) => {
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

  const onRemove = async (file: UploadFileDeprecated) => {
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

  const onRetry = (file: UploadFileDeprecated) => {
    setUploadErrorMessage(undefined)
    onChange([file as File], 1, true)
  }

  const onUploadRejection = (files: FileRejection[]) => {
    files.forEach((file: FileRejection) => {
      if (file.file.size > FILE_SIZE_LIMIT) {
        return setUploadErrorMessage(formatMessage(filesText.sizeErrorMessage))
      }
    })
  }

  const openFileById = (fileId: string) => {
    return openFile({ variables: { input: { id: fileId } } })
  }

  return {
    files,
    uploadErrorMessage,
    onChange,
    onRemove,
    onRetry,
    onUploadRejection,
    uploadFiles,
    uploadStateFiles,
    openFileById,
  }
}
