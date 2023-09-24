import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'

import { toast, UploadFile } from '@island.is/island-ui/core'
import { CaseFileCategory } from '@island.is/judicial-system/types'
import { UserContext } from '@island.is/judicial-system-web/src/components'
import { PresignedPost } from '@island.is/judicial-system-web/src/graphql/schema'

import {
  CreateFileMutation,
  useCreateFileMutation,
} from './createFile.generated'
import {
  CreatePresignedPostMutation,
  useCreatePresignedPostMutation,
} from './createPresignedPost.generated'
import {
  DeleteFileMutation,
  useDeleteFileMutation,
} from './deleteFile.generated'
import {
  LimitedAccessCreateFileMutation,
  useLimitedAccessCreateFileMutation,
} from './limitedAccessCreateFile.generated'
import {
  LimitedAccessCreatePresignedPostMutation,
  useLimitedAccessCreatePresignedPostMutation,
} from './limitedAccessCreatePresignedPost.generated'
import {
  LimitedAccessDeleteFileMutation,
  useLimitedAccessDeleteFileMutation,
} from './limitedAccessDeleteFile.generated'
import { useUploadPoliceCaseFileMutation } from './uploadPoliceCaseFile.generated'
import { strings } from './useS3Upload.strings'

// - rewrite upload from police
// - more granual retry
export interface TUploadFile extends UploadFile {
  category?: CaseFileCategory
  policeCaseNumber?: string
  chapter?: number
  orderWithinChapter?: number
  displayDate?: string
  policeFileId?: string
}

const createFormData = (
  presignedPost: PresignedPost,
  file: TUploadFile,
): FormData => {
  const formData = new FormData()
  Object.keys(presignedPost.fields).forEach((key) =>
    formData.append(key, presignedPost.fields[key]),
  )
  if (file.originalFileObj) {
    formData.append('file', file.originalFileObj)
  }

  return formData
}

const uploadToS3 = (
  file: TUploadFile,
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
        reject('Failed to upload file to S3')
      }
    })

    request.addEventListener('load', () => {
      if (request.status >= 200 && request.status < 300) {
        resolve(file)
      } else {
        reject('Failed to upload file to S3')
      }
    })

    request.open('POST', presignedPost.url)
    request.send(createFormData(presignedPost, file))
  })

  return promise
}

export const useS3Upload = (caseId: string) => {
  const { limitedAccess } = useContext(UserContext)
  const { formatMessage } = useIntl()

  const [createPresignedPost] = useCreatePresignedPostMutation()
  const [limitedAccessCreatePresignedPost] =
    useLimitedAccessCreatePresignedPostMutation()
  const [createFile] = useCreateFileMutation()
  const [limitedAccessCreateFile] = useLimitedAccessCreateFileMutation()
  const [deleteFile] = useDeleteFileMutation()
  const [limitedAccessDeleteFile] = useLimitedAccessDeleteFileMutation()
  const [uploadPoliceCaseFile] = useUploadPoliceCaseFileMutation()

  const upload = useCallback(
    async (
      files: TUploadFile[],
      handleUIUpdate: (file: TUploadFile, newId?: string) => void,
    ) => {
      const mutation = limitedAccess
        ? limitedAccessCreatePresignedPost
        : createPresignedPost

      const getPresignedPost = async (file: TUploadFile) => {
        const { data } = await mutation({
          variables: {
            input: {
              caseId,
              fileName: file.name.normalize(),
              type: file.type ?? '',
            },
          },
        })

        const presignedPost = limitedAccess
          ? (data as LimitedAccessCreatePresignedPostMutation)
              ?.limitedAccessCreatePresignedPost
          : (data as CreatePresignedPostMutation)?.createPresignedPost

        if (!presignedPost?.fields?.key) {
          throw Error('Failed to get presigned post')
        }

        return presignedPost
      }

      const addFileToCaseState = async (file: TUploadFile, key: string) => {
        const mutation = limitedAccess ? limitedAccessCreateFile : createFile

        const { data } = await mutation({
          variables: {
            input: {
              caseId,
              type: file.type ?? '',
              key,
              size: file.size ?? 0,
              category: file.category,
              policeCaseNumber: file.policeCaseNumber,
            },
          },
        })

        const createdFile = limitedAccess
          ? (data as LimitedAccessCreateFileMutation)?.limitedAccessCreateFile
          : (data as CreateFileMutation)?.createFile

        if (!createdFile?.id) {
          throw Error('Failed to add file to case')
        }

        return createdFile.id
      }

      files.forEach(async (file) => {
        try {
          const presignedPost = await getPresignedPost(file)

          await uploadToS3(file, presignedPost, (percent) => {
            handleUIUpdate({ ...file, percent })
          })

          const rvgFileId = await addFileToCaseState(
            file,
            presignedPost.fields.key,
          )

          handleUIUpdate(
            {
              ...file,
              key: presignedPost.fields.key,
              percent: 100,
              status: 'done',
            },
            // We need to set the id so we are able to delete the file later
            rvgFileId,
          )
        } catch (e) {
          toast.error(formatMessage(strings.uploadFailed))
          handleUIUpdate({ ...file, status: 'error' })
        }
      })
    },
    [
      limitedAccess,
      limitedAccessCreatePresignedPost,
      createPresignedPost,
      caseId,
      limitedAccessCreateFile,
      createFile,
      formatMessage,
    ],
  )

  const handleUpload = useCallback(
    (
      uploadFiles: TUploadFile[],
      handleUIUpdate: (displayFile: TUploadFile, newId?: string) => void,
    ) => {
      upload(uploadFiles, handleUIUpdate)
    },
    [upload],
  )

  const handleUploadFromPolice = useCallback(
    async (
      file: TUploadFile,
      handleUIUpdate: (file: TUploadFile, newId?: string) => void,
    ) => {
      try {
        const { data: uploadPoliceCaseFileData } = await uploadPoliceCaseFile({
          variables: {
            input: {
              caseId,
              id: file.policeFileId ?? '',
              name: file.name,
            },
          },
        })

        if (!uploadPoliceCaseFileData?.uploadPoliceCaseFile) {
          throw Error('Failed to upload police file to S3')
        }

        const { data: createFileData } = await createFile({
          variables: {
            input: {
              caseId,
              type: 'application/pdf',
              key: uploadPoliceCaseFileData.uploadPoliceCaseFile.key,
              size: uploadPoliceCaseFileData.uploadPoliceCaseFile.size,
              category: file.category,
              policeCaseNumber: file.policeCaseNumber,
              chapter: file.chapter,
              orderWithinChapter: file.orderWithinChapter,
              displayDate: file.displayDate,
              policeFileId: file.policeFileId,
            },
          },
        })

        if (!createFileData?.createFile.id) {
          throw Error('Failed to add police file to case')
        }

        handleUIUpdate(
          {
            ...file,
            size: uploadPoliceCaseFileData.uploadPoliceCaseFile.size,
            key: uploadPoliceCaseFileData.uploadPoliceCaseFile.key,
            percent: 100,
            status: 'done',
          },
          // We need to set the id so we are able to delete the file later
          createFileData.createFile.id,
        )

        return uploadPoliceCaseFileData?.uploadPoliceCaseFile
      } catch (e) {
        toast.error(formatMessage(strings.uploadFailed))
      }
    },
    [createFile, caseId, formatMessage, uploadPoliceCaseFile],
  )

  const handleRetry = useCallback(
    (
      file: TUploadFile,
      handleUIUpdate: (file: TUploadFile, newId?: string) => void,
    ) => {
      handleUIUpdate({ ...file, percent: 1, status: 'uploading' })

      upload([file], handleUIUpdate)
    },
    [upload],
  )

  const remove = useCallback(
    (fileId: string) => {
      const variables = {
        input: {
          caseId: caseId,
          id: fileId,
        },
      }
      const resopnse: { success: boolean; __typename: 'DeleteFileResponse' } = {
        success: true,
        __typename: 'DeleteFileResponse',
      }

      return limitedAccess
        ? limitedAccessDeleteFile({
            variables,
            optimisticResponse: { limitedAccessDeleteFile: resopnse },
          })
        : deleteFile({
            variables,
            optimisticResponse: { deleteFile: resopnse },
          })
    },
    [caseId, limitedAccess, limitedAccessDeleteFile, deleteFile],
  )

  const handleRemove = useCallback(
    async (file: TUploadFile, handleUIUpdate: (file: TUploadFile) => void) => {
      try {
        if (file.id) {
          const { data } = await remove(file.id)

          const success = limitedAccess
            ? (data as LimitedAccessDeleteFileMutation)?.limitedAccessDeleteFile
                .success
            : (data as DeleteFileMutation)?.deleteFile.success

          if (!success) {
            throw new Error('Failed to delete file')
          }

          handleUIUpdate(file)
        }
      } catch {
        toast.error(formatMessage(strings.removeFailed))
      }
    },
    [formatMessage, limitedAccess, remove],
  )

  return {
    handleUpload,
    handleRetry,
    handleRemove,
    handleUploadFromPolice,
  }
}

export default useS3Upload
