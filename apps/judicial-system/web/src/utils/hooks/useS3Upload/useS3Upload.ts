import { useCallback } from 'react'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'

import { toast, UploadFile } from '@island.is/island-ui/core'
import { CaseFileCategory } from '@island.is/judicial-system/types'
import {
  CreateFileDocument,
  CreateFileMutation,
  CreateFileMutationVariables,
  CreatePresignedPostDocument,
  CreatePresignedPostMutation,
  CreatePresignedPostMutationVariables,
  DeleteFileDocument,
  DeleteFileMutation,
  DeleteFileMutationVariables,
  PresignedPost,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { UploadPoliceCaseFileGql } from '@island.is/judicial-system-web/graphql'
import { errors } from '@island.is/judicial-system-web/messages'

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
    CreatePresignedPostMutation,
    CreatePresignedPostMutationVariables
  >(CreatePresignedPostDocument)
  const [addFileToCaseMutation] = useMutation<
    CreateFileMutation,
    CreateFileMutationVariables
  >(CreateFileDocument)
  const [uploadPoliceCaseFileMutation] = useMutation(UploadPoliceCaseFileGql)
  const [deleteFileMutation] = useMutation<
    DeleteFileMutation,
    DeleteFileMutationVariables
  >(DeleteFileDocument)

  const upload = useCallback(
    async (
      files: Array<[File, string]>,
      updateFile: (file: TUploadFile, newId?: string) => void,
      category?: CaseFileCategory,
      policeCaseNumber?: string,
    ) => {
      files.forEach(async ([file, id]) => {
        try {
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

          const presignedPost = data.data.createPresignedPost

          await uploadToS3(file, presignedPost, (percent) => {
            updateFile({
              id,
              name: file.name,
              percent,
              status: 'uploading',
              category,
            })
          })

          const data2 = await addFileToCaseMutation({
            variables: {
              input: {
                caseId,
                type: file.type,
                key: presignedPost.fields.key,
                size: file.size,
                ...(category && { category }),
                ...(policeCaseNumber && { policeCaseNumber }),
              },
            },
          })
          if (!data2.data?.createFile.id) {
            throw Error('failed to add file to case')
          }

          updateFile(
            {
              id: id,
              name: file.name,
              percent: 100,
              status: 'done',
              category,
              // We need to set the id so we are able to delete the file later
            },
            data2.data.createFile.id,
          )
        } catch (e) {
          updateFile({
            id: id,
            name: file.name,
            status: 'error',
            category,
          })
        }
      })
    },
    [createPresignedMutation, caseId, addFileToCaseMutation],
  )

  const uploadPoliceCaseFile = useCallback(
    async (file: TUploadFile) => {
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

        if (!uploadPoliceCaseFileData.uploadPoliceCaseFile) {
          throw Error('failed to upload police case file')
        }

        const data2 = await addFileToCaseMutation({
          variables: {
            input: {
              caseId,
              type: 'application/pdf',
              key: uploadPoliceCaseFileData.uploadPoliceCaseFile.key,
              size: uploadPoliceCaseFileData.uploadPoliceCaseFile.size,
            },
          },
        })

        if (!data2.data?.createFile.id) {
          throw Error('failed to add file to case')
        }

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

  return { upload, uploadPoliceCaseFile, remove }
}

export default useS3Upload
