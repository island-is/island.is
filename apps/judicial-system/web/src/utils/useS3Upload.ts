import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { UploadFile } from '@island.is/island-ui/core'
import {
  CreateFileMutation,
  CreatePresignedPostMutation,
  DeleteFileMutation,
} from '@island.is/judicial-system-web/graphql'
import { Case, PresignedPost } from '@island.is/judicial-system/types'

export const useS3Upload = (workingCase?: Case) => {
  const [files, setFiles] = useState<UploadFile[]>([])

  useEffect(() => {
    setFiles(workingCase?.files || [])
  }, [workingCase])

  const [createPresignedPostMutation] = useMutation(CreatePresignedPostMutation)
  const [createFileMutation] = useMutation(CreateFileMutation)
  const [deleteFileMutation] = useMutation(DeleteFileMutation)

  // File upload spesific functions
  const createPresignedPost = async (
    filename: string,
  ): Promise<PresignedPost> => {
    const { data: presignedPostData } = await createPresignedPostMutation({
      variables: { input: { caseId: workingCase?.id, fileName: filename } },
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

    request.addEventListener('load', () => {
      if (request.status >= 200 && request.status < 300) {
        file.status = 'done'

        updateFile(file)
        addFileToCase(file)
      } else {
        file.status = 'error'
        updateFile(file)
      }
    })

    request.open('POST', presignedPost.url)
    request.send(createFormData(presignedPost, file))
  }

  // Utils
  /**
   * Get index of file in files. If file is not in files this returns the last index in files plus one.
   *
   * Code smells:
   * This function is not pure, in that it sometimes returns the index of file in files and sometimes files.lenght
   *
   * @param file The file to search for in files.
   * @returns The index of the file or the last index in files plus one.
   */
  const getFileIndexInFiles = (file: UploadFile) => {
    return files.includes(file)
      ? files.findIndex((fileInFiles) => fileInFiles.name === file.name)
      : files.length
  }

  /**
   * Updates a file if it's in files and adds it to the end of files if not.
   * @param file The file to update.
   */
  const updateFile = (file: UploadFile) => {
    const newFiles = [...files]

    newFiles[getFileIndexInFiles(file)] = file

    setFiles(newFiles)
  }

  const removeFileFromState = (file: UploadFile) => {
    const newFiles = [...files]

    if (newFiles.includes(file)) {
      setFiles(newFiles.filter((fileInFiles) => fileInFiles !== file))
    }
  }

  /**
   * Insert file in database and update state.
   * @param file The file to add to case.
   */
  const addFileToCase = async (file: UploadFile) => {
    if (workingCase && file.size && file.key) {
      const { data: createFileMutationResponse } = await createFileMutation({
        variables: {
          input: {
            caseId: workingCase.id,
            key: file.key,
            size: file.size,
          },
        },
      })

      file.id = createFileMutationResponse.createFile.id
      updateFile(file)
    }
  }

  // Event handlers
  const onChange = (newFiles: File[]) => {
    const newUploadFiles = newFiles as UploadFile[]

    setFiles([...files, ...newUploadFiles])

    newUploadFiles.forEach(async (file) => {
      const presignedPost = await createPresignedPost(file.name)

      if (!presignedPost) {
        return
      }

      file.key = presignedPost.fields.key

      updateFile(file)

      uploadToS3(file, presignedPost)
    })
  }

  const onRemove = (file: UploadFile) => {
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
          console.log(res.graphQLErrors)
        })
    }
  }

  return { files, onChange, onRemove }
}
