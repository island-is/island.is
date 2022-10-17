import { useCallback } from 'react'
import { useMutation } from '@apollo/client'

import { UploadFile } from '@island.is/island-ui/core'
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
} from '@island.is/judicial-system-web/src/graphql/schema'

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

export const useS3UploadV2 = (
  caseId: string,
  category: CaseFileCategory,
  policeCaseNumber: string,
) => {
  const [createPresignedMutation] = useMutation<
    CreatePresignedPostMutationMutation,
    CreatePresignedPostMutationMutationVariables
  >(CreatePresignedPostMutationDocument)
  const [addFileToCaseMutation] = useMutation<
    CreateFileMutationMutation,
    CreateFileMutationMutationVariables
  >(CreateFileMutationDocument)

  const [deleteFileMutation] = useMutation<
    DeleteFileMutationMutation,
    DeleteFileMutationMutationVariables
  >(DeleteFileMutationDocument)

  const upload = useCallback(
    (files: Array<[File, string]>, updateFile: (file: UploadFile) => void) => {
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
            })
          })

          const data2 = await addFileToCaseMutation({
            variables: {
              input: {
                caseId,
                type: file.type,
                key: presignedPost.fields.key,
                size: file.size,
                category: category,
                policeCaseNumber: policeCaseNumber,
              },
            },
          })
          if (!data2.data?.createFile.id) {
            throw Error('failed to add file to case')
          }

          updateFile({
            name: file.name,
            percent: 100,
            status: 'done',
            // We need to set the id so we are able to delete the file later
            id: data2.data.createFile.id,
          })
        } catch (e) {
          updateFile({
            id: id,
            name: file.name,
            status: 'error',
          })
        }
      })
    },
    [
      createPresignedMutation,
      caseId,
      addFileToCaseMutation,
      category,
      policeCaseNumber,
    ],
  )

  const remove = useCallback(
    (fileId) => {
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

  return { upload, remove }
}

export default useS3UploadV2
