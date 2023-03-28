import { useCallback } from 'react'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'

import { toast, UploadFile } from '@island.is/island-ui/core'
import { CaseFileCategory } from '@island.is/judicial-system/types'
import {
  CreateFileMutationDocument,
  CreateFileMutationMutation,
  CreateFileMutationMutationVariables,
  CreatePresignedPostMutationDocument,
  CreatePresignedPostMutationMutation,
  CreatePresignedPostMutationMutationVariables,
  DeleteFileMutationDocument,
  DeleteFileMutationMutation,
  DeleteFileMutationMutationVariables,
  PresignedPost,
  UploadPoliceCaseFileMutationMutation,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { UploadPoliceCaseFileMutation } from '@island.is/judicial-system-web/graphql'
import { errors } from '@island.is/judicial-system-web/messages'
import { uuid } from 'uuidv4'

export interface TUploadFile extends UploadFile {
  category?: CaseFileCategory
  policeCaseNumber?: string
}

const createFormData = (presignedPost: PresignedPost, file: File): FormData => {
  const formData = new FormData()
  Object.keys(presignedPost.fields).forEach((key) =>
    formData.append(key, presignedPost.fields[key]),
  )
  formData.append('file', file)

  return formData
}

const uploadToS3 = (
  file: File,
  presignedPost: PresignedPost,
  onProgress: (percent: number) => void,
) => {
  const promise = new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.withCredentials = true
    request.responseType = 'json'

    request.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        onProgress((event.loaded / event.total) * 100)
      }
    })

    request.upload.addEventListener('error', (event) => {
      if (event.lengthComputable) {
        reject()
      }
    })

    request.addEventListener('load', () => {
      if (request.status >= 200 && request.status < 300) {
        resolve(file)
      } else {
        reject()
      }
    })

    request.open('POST', presignedPost.url)
    request.send(createFormData(presignedPost, file))
  })
  return promise
}

export const useS3Upload = (caseId: string) => {
  const { formatMessage } = useIntl()
  const [createPresignedMutation] = useMutation<
    CreatePresignedPostMutationMutation,
    CreatePresignedPostMutationMutationVariables
  >(CreatePresignedPostMutationDocument)
  const [addFileToCaseMutation] = useMutation<
    CreateFileMutationMutation,
    CreateFileMutationMutationVariables
  >(CreateFileMutationDocument)
  const [
    uploadPoliceCaseFileMutation,
  ] = useMutation<UploadPoliceCaseFileMutationMutation>(
    UploadPoliceCaseFileMutation,
  )
  const [deleteFileMutation] = useMutation<
    DeleteFileMutationMutation,
    DeleteFileMutationMutationVariables
  >(DeleteFileMutationDocument)

  const upload = useCallback(
    async (
      files: Array<[File, string]>,
      handleUIUpdate: (file: TUploadFile, newId?: string) => void,
      category?: CaseFileCategory,
      policeCaseNumber?: string,
    ) => {
      const createPresignedPost = async (file: File) => {
        const data = await createPresignedMutation({
          variables: {
            input: {
              caseId,
              fileName: file.name.normalize(),
              type: file.type ?? '',
            },
          },
        })

        if (!data.data?.createPresignedPost.fields?.key) {
          throw Error('failed to get presigned post')
        }

        return data.data.createPresignedPost
      }

      const addFileToCaseState = async (
        file: File,
        key: string,
        category?: CaseFileCategory,
        policeCaseNumber?: string,
      ) => {
        const data = await addFileToCaseMutation({
          variables: {
            input: {
              caseId,
              type: file.type,
              key,
              size: file.size,
              ...(category && { category }),
              ...(policeCaseNumber && { policeCaseNumber }),
            },
          },
        })

        if (!data.data?.createFile.id) {
          throw Error('failed to add file to case')
        }

        return data.data.createFile.id
      }

      files.forEach(async ([file, id]) => {
        try {
          const presignedPost = await createPresignedPost(file)

          await uploadToS3(file, presignedPost, (percent) => {
            handleUIUpdate({
              id,
              name: file.name,
              percent,
              status: 'uploading',
              category,
            })
          })

          const rvgFileId = await addFileToCaseState(
            file,
            presignedPost.fields.key,
            category,
            policeCaseNumber,
          )

          handleUIUpdate(
            {
              id,
              name: file.name,
              percent: 100,
              status: 'done',
              category,
            },
            // We need to set the id so we are able to delete the file later
            rvgFileId,
          )
        } catch (e) {
          handleUIUpdate({
            id,
            name: file.name,
            status: 'error',
            category,
          })
        }
      })
    },
    [createPresignedMutation, caseId, addFileToCaseMutation],
  )

  const handleChange = useCallback(
    (
      files: File[],
      category: CaseFileCategory,
      setDisplayFiles: React.Dispatch<React.SetStateAction<TUploadFile[]>>,
      cb: (displayFile: TUploadFile, newId?: string) => void,
    ) => {
      // We generate an id for each file so that we find the file again when
      // updating the file's progress and onRetry.
      // Also we cannot spread File since it contains read-only properties.
      const filesWithId: Array<[File, string]> = files.map((file) => [
        file,
        `${file.name}-${uuid()}`,
      ])
      setDisplayFiles((previous) => [
        ...filesWithId.map(
          ([file, id]): TUploadFile => ({
            status: 'uploading',
            percent: 1,
            name: file.name,
            id: id,
            type: file.type,
            category,
          }),
        ),
        ...previous,
      ])
      upload(filesWithId, cb, category)
    },
    [upload],
  )

  const uploadPoliceCaseFile = useCallback(
    async (
      file: TUploadFile,
      cb: (file: TUploadFile, newId?: string) => void,
    ) => {
      try {
        const {
          data: uploadPoliceCaseFileData,
        } = await uploadPoliceCaseFileMutation({
          variables: {
            input: {
              caseId,
              id: file.id,
              name: file.name,
            },
          },
        })

        if (
          !uploadPoliceCaseFileData ||
          !uploadPoliceCaseFileData.uploadPoliceCaseFile
        ) {
          throw Error('failed to upload police case file')
        }

        const data2 = await addFileToCaseMutation({
          variables: {
            input: {
              caseId,
              type: 'application/pdf',
              key: uploadPoliceCaseFileData.uploadPoliceCaseFile.key,
              size: uploadPoliceCaseFileData.uploadPoliceCaseFile.size,
              policeCaseNumber: file.policeCaseNumber,
              category: file.category,
            },
          },
        })

        if (!data2.data?.createFile.id) {
          throw Error('failed to add file to case')
        }

        cb(
          {
            id: file.id,
            name: file.name,
            percent: 100,
            status: 'done',
            category: file.category,
          },
          // We need to set the id so we are able to delete the file later
          data2.data.createFile.id,
        )

        return uploadPoliceCaseFileData?.uploadPoliceCaseFile
      } catch (e) {
        toast.error(formatMessage(errors.failedUploadFile))
      }
    },
    [
      addFileToCaseMutation,
      caseId,
      formatMessage,
      uploadPoliceCaseFileMutation,
    ],
  )

  const remove = useCallback(
    (fileId: string) => {
      return deleteFileMutation({
        variables: {
          input: {
            caseId: caseId,
            id: fileId,
          },
        },
        optimisticResponse: {
          deleteFile: { success: true, __typename: 'DeleteFileResponse' },
        },
      })
    },
    [deleteFileMutation, caseId],
  )

  const handleRetry = useCallback(
    (
      file: UploadFile,
      handleUIUpdate: (file: TUploadFile, newId?: string) => void,
    ) => {
      handleUIUpdate({
        name: file.name,
        id: file.id,
        percent: 1,
        status: 'uploading',
        type: file.type,
      })
      upload(
        [
          [
            { name: file.name, type: file.type ?? '' } as File,
            file.id ?? file.name,
          ],
        ],
        handleUIUpdate,
      )
    },
    [upload],
  )

  const handleRemove = useCallback(
    async (file: UploadFile, cb?: (file: UploadFile) => void) => {
      try {
        if (file.id) {
          const response = await remove(file.id)

          if (!response.data?.deleteFile.success) {
            throw new Error(`Failed to delete file: ${file.id}`)
          }

          if (cb) {
            cb(file)
          }
        }
      } catch {
        toast.error(formatMessage(errors.general))
      }
    },
    [formatMessage, remove],
  )

  const generateSingleFileUpdate = useCallback(
    (prevFiles: UploadFile[], displayFile: UploadFile, newId?: string) => {
      const index = prevFiles.findIndex((f) => f.id === displayFile.id)
      const displayFileWithId = {
        ...displayFile,
        id: newId ?? displayFile.id,
      }

      if (index === -1) {
        return prevFiles
      }

      const next = [...prevFiles]
      next[index] = displayFileWithId
      return next
    },
    [],
  )

  return {
    upload,
    uploadPoliceCaseFile,
    remove,
    handleRetry,
    handleRemove,
    handleChange,
    generateSingleFileUpdate,
  }
}

export default useS3Upload
