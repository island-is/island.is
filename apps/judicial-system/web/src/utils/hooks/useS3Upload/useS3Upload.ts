import { useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { uuid } from 'uuidv4'

import { toast, UploadFile } from '@island.is/island-ui/core'
import { UserContext } from '@island.is/judicial-system-web/src/components'
import {
  CaseFile,
  CaseFileCategory,
  PresignedPost,
} from '@island.is/judicial-system-web/src/graphql/schema'

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
  category?: CaseFileCategory | null
  policeCaseNumber?: string | null
  chapter?: number | null
  orderWithinChapter?: number | null
  displayDate?: string | null
  policeFileId?: string | null
}

export interface UploadFileState {
  isUploading: boolean
  error: boolean
}

const mapCaseFileToUploadFile = (file: CaseFile): TUploadFile => ({
  id: file.id,
  name: file.name ?? '',
  type: file.type ?? undefined,
  size: file.size ?? undefined,
  key: file.key ?? undefined,
  percent: 100,
  status: 'done',
  category: file.category,
  policeCaseNumber: file.policeCaseNumber,
  chapter: file.chapter,
  orderWithinChapter: file.orderWithinChapter,
  displayDate: file.displayDate,
  policeFileId: file.policeFileId,
})

export const useUploadFiles = (files?: CaseFile[] | null) => {
  const [uploadFiles, setUploadFiles] = useState<TUploadFile[]>(
    files?.map(mapCaseFileToUploadFile) ?? [],
  )

  useEffect(() => {
    setUploadFiles(files?.map(mapCaseFileToUploadFile) ?? [])
  }, [files])

  const allFilesUploaded = uploadFiles.every(
    (file) => file.status === 'done' || file.status === 'error',
  )

  const addUploadFile = (file: TUploadFile) =>
    setUploadFiles((previous) => [file, ...previous])

  const addUploadFiles = (
    files: File[],
    category?: CaseFileCategory,
    policeCaseNumber?: string,
    /**
     * Use this to overwrite default file attributes, f.x.
     * if you want to set a custom status or percent.
     **/
    overwriteDefaultFileAttributes?: Partial<TUploadFile>,
  ) => {
    // We generate an id for each file so that we find the file again when
    // updating the file's progress and onRetry.
    // Also we cannot spread File since it contains read-only properties.
    const uploadFiles: TUploadFile[] = files.map((file) => ({
      id: overwriteDefaultFileAttributes?.id ?? `${file.name}-${uuid()}`,
      name: overwriteDefaultFileAttributes?.name ?? file.name,
      type: overwriteDefaultFileAttributes?.type ?? file.type,
      size: overwriteDefaultFileAttributes?.size ?? file.size,
      percent: overwriteDefaultFileAttributes?.percent ?? 1,
      status: overwriteDefaultFileAttributes?.status ?? 'uploading',
      category: overwriteDefaultFileAttributes?.category ?? category,
      policeCaseNumber:
        overwriteDefaultFileAttributes?.policeCaseNumber ?? policeCaseNumber,
      originalFileObj: overwriteDefaultFileAttributes?.originalFileObj ?? file,
    }))

    setUploadFiles((previous) => [...uploadFiles, ...previous])

    return uploadFiles
  }

  const updateUploadFile = (file: TUploadFile, newId?: string) =>
    setUploadFiles((previous) =>
      previous.map((f) =>
        f.id === file.id ? { ...f, ...file, id: newId ?? file.id } : f,
      ),
    )

  const removeUploadFile = (file: TUploadFile) =>
    setUploadFiles((previous) =>
      previous.filter((caseFile) => caseFile.id !== file.id),
    )

  return {
    uploadFiles,
    allFilesUploaded,
    addUploadFile,
    addUploadFiles,
    updateUploadFile,
    removeUploadFile,
  }
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

const useS3Upload = (caseId: string) => {
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

  const addFileToCaseState = useCallback(
    async (file: TUploadFile) => {
      const mutation = limitedAccess ? limitedAccessCreateFile : createFile

      const { data } = await mutation({
        variables: {
          input: {
            caseId,
            type: file.type ?? '',
            key: file.key ?? '',
            size: file.size ?? 0,
            category: file.category,
            policeCaseNumber: file.policeCaseNumber,
            chapter: file.chapter,
            orderWithinChapter: file.orderWithinChapter,
            displayDate: file.displayDate,
            policeFileId: file.policeFileId,
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
    },
    [limitedAccess, limitedAccessCreateFile, createFile, caseId],
  )

  const handleUpload = useCallback(
    async (
      files: TUploadFile[],
      updateFile: (file: TUploadFile, newId?: string) => void,
    ) => {
      const mutation = limitedAccess
        ? limitedAccessCreatePresignedPost
        : createPresignedPost
      const filesUploaded = []

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

      for (const file of files) {
        try {
          const presignedPost = await getPresignedPost(file)

          await uploadToS3(file, presignedPost, (percent) => {
            updateFile({ ...file, percent })
          })

          const newFileId = await addFileToCaseState({
            ...file,
            key: presignedPost.fields.key,
          })

          updateFile(
            {
              ...file,
              key: presignedPost.fields.key,
              percent: 100,
              status: 'done',
            },
            // We need to set the id so we are able to delete the file later
            newFileId,
          )

          filesUploaded.push(file)
        } catch (e) {
          toast.error(formatMessage(strings.uploadFailed))
          updateFile({ ...file, status: 'error' })
        }
      }

      return filesUploaded.length === files.length
    },
    [
      limitedAccess,
      limitedAccessCreatePresignedPost,
      createPresignedPost,
      caseId,
      addFileToCaseState,
      formatMessage,
    ],
  )

  const handleUploadFromPolice = useCallback(
    async (
      files: TUploadFile[],
      callback: (file: TUploadFile, newId?: string) => void,
    ) => {
      const promises = files.map(async (file) => {
        return uploadPoliceCaseFile({
          variables: {
            input: {
              caseId,
              id: file.policeFileId ?? '',
              name: file.name,
            },
          },
        })
          .then(async ({ data: uploadPoliceCaseFileData }) => {
            if (!uploadPoliceCaseFileData?.uploadPoliceCaseFile) {
              throw Error('Failed to upload police file to S3')
            }

            const newFileId = await addFileToCaseState({
              ...file,
              key: uploadPoliceCaseFileData.uploadPoliceCaseFile.key,
              size: uploadPoliceCaseFileData.uploadPoliceCaseFile.size,
            })

            callback(
              {
                ...file,
                size: uploadPoliceCaseFileData.uploadPoliceCaseFile.size,
                key: uploadPoliceCaseFileData.uploadPoliceCaseFile.key,
                percent: 100,
                status: 'done',
              },
              // We need to set the id so we are able to delete the file later
              newFileId,
            )
          })
          .catch(() => {
            toast.error(formatMessage(strings.uploadFailed))
            callback(file)
          })
      })

      return Promise.all(promises)
    },
    [uploadPoliceCaseFile, caseId, addFileToCaseState, formatMessage],
  )

  const handleRetry = useCallback(
    (
      file: TUploadFile,
      callback: (file: TUploadFile, newId?: string) => void,
    ) => {
      callback({ ...file, percent: 1, status: 'uploading' })

      handleUpload([file], callback)
    },
    [handleUpload],
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
    async (file: TUploadFile, callback: (file: TUploadFile) => void) => {
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

          callback(file)
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
