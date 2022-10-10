import { useCallback, useState } from 'react'
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
  PresignedPost,
} from '@island.is/judicial-system-web/src/graphql/schema'

export type LocalUploadFile = UploadFile & { displayId: string }

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
  index: number,
  setFileState: (uploadFile: LocalUploadFile) => void,
) => {
  const promise = new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.withCredentials = true
    request.responseType = 'json'

    request.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        setFileState({
          displayId: `${file.name}-${index}`,
          name: file.name,
          percent: (event.loaded / event.total) * 100,
          status: 'uploading',
        })
      }
    })

    request.upload.addEventListener('error', (event) => {
      if (event.lengthComputable) {
        setFileState({
          displayId: `${file.name}-${index}`,
          name: file.name,
          percent: 0,
          status: 'error',
        })
        reject()
      }
    })

    request.addEventListener('load', () => {
      console.log('load', request.status, request)
      if (request.status >= 200 && request.status < 300) {
        console.log('onLoad', 'success')
        resolve(file)
      } else {
        setFileState({
          displayId: `${file.name}-${index}`,
          name: file.name,
          percent: 0,
          status: 'error',
        })
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

  const upload = useCallback(
    (files: File[], updateFile) => {
      files.forEach(async (file, index) => {
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
          if (
            data.errors ||
            !data.data ||
            !data.data?.createPresignedPost.fields?.key
          ) {
            return
          }

          const presignedPost = data.data.createPresignedPost
          await uploadToS3(file, presignedPost, index, updateFile)

          console.log('addFileToCaseMutation')

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
          console.log('addFileToCaseMutation', data2)

          if (data2.errors || !data2.data || !data2.data.createFile.id) {
            return
          }

          updateFile({
            displayId: `${file.name}-${index}`,
            name: file.name,
            percent: 100,
            status: 'done',
            id: data2.data.createFile.id,
          })
        } catch (_e) {
          return
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

  return upload
}

export default useS3UploadV2
