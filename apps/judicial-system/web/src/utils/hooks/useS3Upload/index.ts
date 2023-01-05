import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'

import { UploadFile } from '@island.is/island-ui/core'
import {
  CreateFileMutation,
  CreatePresignedPostMutation,
  UploadPoliceCaseFileMutation,
} from '@island.is/judicial-system-web/graphql'
import {
  Case,
  CaseFileCategory,
  PresignedPost,
  UploadPoliceCaseFileResponse,
} from '@island.is/judicial-system/types'
import { errors } from '@island.is/judicial-system-web/messages'

import { TUploadFile } from '../useS3UploadV2/useS3UploadV2'

export const useS3Upload = (workingCase: Case) => {
  const [files, setFiles] = useState<TUploadFile[]>([])
  const [allFilesUploaded, setAllFilesUploaded] = useState<boolean>(true)
  const filesRef = useRef<UploadFile[]>(files)
  const { formatMessage } = useIntl()

  useEffect(() => {
    const uploadCaseFiles = workingCase.caseFiles?.map((caseFile) => {
      const uploadCaseFile = caseFile as UploadFile
      uploadCaseFile.status = 'done'
      return uploadCaseFile
    })

    setFilesRefAndState(uploadCaseFiles ?? [])
  }, [workingCase.caseFiles])

  useMemo(() => {
    setAllFilesUploaded(
      files.filter((file) => file.status === 'done' || file.status === 'error')
        .length === files.length,
    )
  }, [files])

  const [
    uploadPoliceCaseFileMutation,
    { error: uploadPoliceCaseFileFailed },
  ] = useMutation(UploadPoliceCaseFileMutation)
  const [
    createPresignedPostMutation,
    { error: createPresignedPostFailed },
  ] = useMutation(CreatePresignedPostMutation)
  const [createFileMutation, { error: createFileFailed }] = useMutation(
    CreateFileMutation,
  )

  // File upload spesific functions
  const uploadPoliceCaseFile = async (
    id: string,
    name: string,
  ): Promise<UploadPoliceCaseFileResponse> => {
    try {
      const {
        data: uploadPoliceCaseFileData,
      } = await uploadPoliceCaseFileMutation({
        variables: {
          input: {
            caseId: workingCase.id,
            id: id,
            name: name,
          },
        },
      })

      return uploadPoliceCaseFileData?.uploadPoliceCaseFile
    } catch (error) {
      return { key: '', size: -1 }
    }
  }

  const createPresignedPost = async (
    fileName: string,
    type: string,
  ): Promise<PresignedPost> => {
    try {
      const { data: presignedPostData } = await createPresignedPostMutation({
        variables: {
          input: {
            caseId: workingCase.id,
            fileName,
            type,
          },
        },
      })

      return presignedPostData?.createPresignedPost
    } catch (error) {
      return { url: '', fields: {} }
    }
  }

  const createFormData = (
    presignedPost: PresignedPost,
    file: UploadFile,
  ): FormData => {
    const formData = new FormData()
    Object.keys(presignedPost.fields).forEach((key) =>
      formData.append(key, presignedPost.fields[key]),
    )
    formData.append('file', file as File)

    return formData
  }

  const uploadToS3 = (file: UploadFile, presignedPost: PresignedPost) => {
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
        addFileToCase(file, updateFile)
      } else {
        file.status = 'error'
        file.percent = 0
        updateFile(file)
      }
    })

    request.open('POST', presignedPost.url)
    request.send(createFormData(presignedPost, file as UploadFile))
  }

  // Utils
  /**
   * Sets ref and state value
   * @param files Files to set to state.
   */
  const setFilesRefAndState = (files: UploadFile[]) => {
    filesRef.current = files
    setFiles(files)
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
    if (newFiles.some((f) => f.key === file.key)) {
      const index = newFiles.findIndex((f) => f.key === file.key)
      newFiles[index] = file
    } else {
      newFiles.push(file)
    }

    setFilesRefAndState(newFiles)
  }

  /**
   * Insert file in database and update state.
   * @param file The file to add to case.
   */
  const addFileToCase = async (
    file: TUploadFile,
    cb: (file: TUploadFile) => void,
  ) => {
    if (workingCase && file.size && file.key) {
      await createFileMutation({
        variables: {
          input: {
            caseId: workingCase.id,
            type: file.type,
            key: file.key,
            size: file.size,
            category: file.category,
            policeCaseNumber: file.policeCaseNumber,
          },
        },
      })
        .then((res) => {
          file.id = res.data.createFile.id
          file.status = 'done'
          cb(file)
        })
        .catch(() => {
          // TODO: handle error
        })
    }
  }

  // Event handlers
  const handleS3Upload = (
    newFiles: File[],
    isRetry?: boolean,
    filesCategory?: CaseFileCategory,
  ) => {
    newFiles.forEach(async (file: TUploadFile) => {
      file.category = filesCategory
    })

    if (!isRetry) {
      setFilesRefAndState([...newFiles, ...files])
    }

    newFiles.forEach(async (file: TUploadFile) => {
      const presignedPost = await createPresignedPost(
        file.name.normalize(),
        file.type ?? '',
      )

      if (presignedPost.url === '') {
        file.status = 'error'
        file.percent = 0
        updateFile(file)

        return
      }

      file.key = presignedPost.fields.key
      updateFile(file)

      uploadToS3(file, presignedPost)
    })
  }

  const handleRetry = (file: UploadFile) => {
    handleS3Upload([file as File], true)
  }

  return {
    files,
    uploadErrorMessage:
      uploadPoliceCaseFileFailed ||
      createFileFailed ||
      createPresignedPostFailed
        ? formatMessage(errors.general)
        : undefined,
    allFilesUploaded,
    uploadPoliceCaseFile,
    addFileToCase,
    handleRetry,
  }
}
