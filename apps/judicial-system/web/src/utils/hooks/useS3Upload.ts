import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation } from '@apollo/client'
import { UploadFile } from '@island.is/island-ui/core'
import {
  CreateFileMutation,
  CreatePresignedPostMutation,
  DeleteFileMutation,
  UploadPoliceCaseFileMutation,
} from '@island.is/judicial-system-web/graphql'
import {
  Case,
  PresignedPost,
  UploadPoliceCaseFileResponse,
} from '@island.is/judicial-system/types'

export const useS3Upload = (workingCase?: Case) => {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string>()
  const [allFilesUploaded, setAllFilesUploaded] = useState<boolean>(true)
  const filesRef = useRef<UploadFile[]>(files)

  useEffect(() => {
    const uploadCaseFiles = workingCase?.caseFiles?.map((caseFile) => {
      const uploadCaseFile = caseFile as UploadFile
      uploadCaseFile.status = 'done'
      return uploadCaseFile
    })

    setFilesRefAndState(uploadCaseFiles ?? [])
  }, [workingCase?.caseFiles])

  useMemo(() => {
    setAllFilesUploaded(
      files.filter((file) => file.status === 'done' || file.status === 'error')
        .length === files.length,
    )
  }, [files])

  const [uploadPoliceCaseFileMutation] = useMutation(
    UploadPoliceCaseFileMutation,
  )
  const [createPresignedPostMutation] = useMutation(CreatePresignedPostMutation)
  const [createFileMutation] = useMutation(CreateFileMutation)
  const [deleteFileMutation] = useMutation(DeleteFileMutation)

  // File upload spesific functions
  const uploadPoliceCaseFile = async (
    id: string,
    name: string,
  ): Promise<UploadPoliceCaseFileResponse> => {
    const {
      data: uploadPoliceCaseFileData,
    } = await uploadPoliceCaseFileMutation({
      variables: {
        input: {
          caseId: workingCase?.id,
          id: id,
          name: name,
        },
      },
    })

    return uploadPoliceCaseFileData?.uploadPoliceCaseFile
  }

  const createPresignedPost = async (
    filename: string,
    type: string,
  ): Promise<PresignedPost> => {
    const { data: presignedPostData } = await createPresignedPostMutation({
      variables: {
        input: {
          caseId: workingCase?.id,
          fileName: filename,
          type,
        },
      },
    })

    return presignedPostData?.createPresignedPost
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
        addFileToCase(file)
      } else {
        file.status = 'error'
        file.percent = 0
        updateFile(file)
      }
    })

    request.open('POST', presignedPost.url)
    request.send(createFormData(presignedPost, file))
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

  const removeFileFromState = (file: UploadFile) => {
    const newFiles = [...files]

    if (newFiles.includes(file)) {
      setFilesRefAndState(
        newFiles.filter((fileInFiles) => fileInFiles !== file),
      )
    }
  }

  /**
   * Insert file in database and update state.
   * @param file The file to add to case.
   */
  const addFileToCase = async (file: UploadFile) => {
    if (workingCase && file.size && file.key) {
      await createFileMutation({
        variables: {
          input: {
            caseId: workingCase.id,
            type: file.type,
            key: file.key,
            size: file.size,
          },
        },
      })
        .then((res) => {
          file.id = res.data.createFile.id
          file.status = 'done'
          updateFile(file)
        })
        .catch((reason) => {
          // TODO: Log to sentry
          setUploadErrorMessage(
            'Upp kom óvænt kerfisvilla. Vinsamlegast reynið aftur.',
          )
          console.log(reason)
        })
    }
  }

  // Event handlers
  const onChange = (newFiles: File[], isRetry?: boolean) => {
    setUploadErrorMessage(undefined)
    const newUploadFiles = newFiles as UploadFile[]

    if (!isRetry) {
      setFilesRefAndState([...newUploadFiles, ...files])
    }

    newUploadFiles.forEach(async (file) => {
      const presignedPost = await createPresignedPost(
        file.name.normalize(),
        file.type ?? '',
      ).catch(() =>
        setUploadErrorMessage(
          'Upp kom óvænt kerfisvilla. Vinsamlegast reynið aftur.',
        ),
      )

      if (!presignedPost) {
        return
      }

      file.key = presignedPost.fields.key
      updateFile(file)

      uploadToS3(file, presignedPost)
    })
  }

  const onRemove = (file: UploadFile) => {
    setUploadErrorMessage(undefined)

    if (workingCase) {
      deleteFileMutation({
        variables: {
          input: {
            caseId: workingCase.id,
            id: file.id,
          },
        },
      })
        .then((res) => {
          if (!res.errors) {
            removeFileFromState(file)
          } else {
            // TODO: handle failure
            console.log(res.errors)
          }
        })
        .catch((res) => {
          // TODO: Log to Sentry and display an error message.
          console.log(res)
          setUploadErrorMessage(
            'Upp kom óvænt kerfisvilla. Vinsamlegast reynið aftur.',
          )
        })
    }
  }

  const onRetry = (file: UploadFile) => {
    setUploadErrorMessage(undefined)
    onChange([file as File], true)
  }

  return {
    files,
    uploadErrorMessage,
    allFilesUploaded,
    uploadPoliceCaseFile,
    addFileToCase,
    onChange,
    onRemove,
    onRetry,
  }
}
