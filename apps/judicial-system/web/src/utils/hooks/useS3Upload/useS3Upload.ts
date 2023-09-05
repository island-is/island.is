import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { uuid } from 'uuidv4'
import { toast, UploadFile } from '@island.is/island-ui/core'
import { CaseFileCategory } from '@island.is/judicial-system/types'
import { errors } from '@island.is/judicial-system-web/messages'
import { UserContext } from '@island.is/judicial-system-web/src/components'
import { PresignedPost } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  CreatePresignedPostMutation,
  useCreatePresignedPostMutation,
} from './createPresignedPost.generated'
import {
  LimitedAccessCreatePresignedPostMutation,
  useLimitedAccessCreatePresignedPostMutation,
} from './limitedAccessCreatePresignedPost.generated'
import {
  CreateFileMutation,
  useCreateFileMutation,
} from './createFile.generated'
import {
  LimitedAccessCreateFileMutation,
  useLimitedAccessCreateFileMutation,
} from './limitedAccessCreateFile.generated'
import {
  DeleteFileMutation,
  useDeleteFileMutation,
} from './deleteFile.generated'
import {
  LimitedAccessDeleteFileMutation,
  useLimitedAccessDeleteFileMutation,
} from './limitedAccessDeleteFile.generated'
import { useUploadPoliceCaseFileMutation } from './uploadPoliceCaseFile.generated'

export interface TUploadFile extends UploadFile {
  category?: CaseFileCategory
  policeCaseNumber?: string
  chapter?: number
  orderWithinChapter?: number
  displayDate?: string
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
      files: Array<[File, string]>,
      handleUIUpdate: (file: TUploadFile, newId?: string) => void,
      category?: CaseFileCategory,
      policeCaseNumber?: string,
    ) => {
      const mutation = limitedAccess
        ? limitedAccessCreatePresignedPost
        : createPresignedPost

      const getPresignedPost = async (file: File) => {
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
          throw Error('failed to get presigned post')
        }

        return presignedPost
      }

      const addFileToCaseState = async (
        file: File,
        key: string,
        category?: CaseFileCategory,
        policeCaseNumber?: string,
      ) => {
        const mutation = limitedAccess ? limitedAccessCreateFile : createFile

        const { data } = await mutation({
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

        const createdFile = limitedAccess
          ? (data as LimitedAccessCreateFileMutation)?.limitedAccessCreateFile
          : (data as CreateFileMutation)?.createFile

        if (!createdFile?.id) {
          throw Error('failed to add file to case')
        }

        return createdFile.id
      }

      files.forEach(async ([file, id]) => {
        try {
          const presignedPost = await getPresignedPost(file)

          await uploadToS3(file, presignedPost, (percent) => {
            handleUIUpdate({
              id,
              name: file.name,
              type: file.type,
              size: file.size,
              percent,
              status: 'uploading',
              category,
              policeCaseNumber,
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
              type: file.type,
              size: file.size,
              percent: 100,
              status: 'done',
              category,
              policeCaseNumber,
            },
            // We need to set the id so we are able to delete the file later
            rvgFileId,
          )
        } catch (e) {
          handleUIUpdate({
            id,
            name: file.name,
            type: file.type,
            size: file.size,
            status: 'error',
            category,
            policeCaseNumber,
          })
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
    ],
  )

  const handleChange = useCallback(
    (
      files: File[],
      category: CaseFileCategory,
      setDisplayFiles: React.Dispatch<React.SetStateAction<TUploadFile[]>>,
      cb: (displayFile: TUploadFile, newId?: string) => void,
      policeCaseNumber?: string,
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
            policeCaseNumber,
          }),
        ),
        ...previous,
      ])
      upload(filesWithId, cb, category, policeCaseNumber)
    },
    [upload],
  )

  const uploadFromPolice = useCallback(
    async (
      file: TUploadFile,
      cb: (file: TUploadFile, newId?: string) => void,
    ) => {
      try {
        const { data: uploadPoliceCaseFileData } = await uploadPoliceCaseFile({
          variables: {
            input: {
              caseId,
              id: file.id ?? '',
              name: file.name,
            },
          },
        })

        if (!uploadPoliceCaseFileData?.uploadPoliceCaseFile) {
          throw Error('failed to upload police case file')
        }

        const { data: createFileData } = await createFile({
          variables: {
            input: {
              caseId,
              type: 'application/pdf',
              key: uploadPoliceCaseFileData.uploadPoliceCaseFile.key,
              size: uploadPoliceCaseFileData.uploadPoliceCaseFile.size,
              policeCaseNumber: file.policeCaseNumber,
              category: file.category,
              chapter: file.chapter,
              orderWithinChapter: file.orderWithinChapter,
              displayDate: file.displayDate,
            },
          },
        })

        if (!createFileData?.createFile.id) {
          throw Error('failed to add file to case')
        }

        cb(
          {
            id: file.id,
            name: file.name,
            type: 'application/pdf',
            percent: 100,
            status: 'done',
            category: file.category,
            policeCaseNumber: file.policeCaseNumber,
            chapter: file.chapter,
            orderWithinChapter: file.orderWithinChapter,
            displayDate: file.displayDate,
          },
          // We need to set the id so we are able to delete the file later
          createFileData.createFile.id,
        )

        return uploadPoliceCaseFileData?.uploadPoliceCaseFile
      } catch (e) {
        toast.error(formatMessage(errors.failedUploadFile))
      }
    },
    [createFile, caseId, formatMessage, uploadPoliceCaseFile],
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

  const handleRetry = useCallback(
    (
      file: UploadFile,
      handleUIUpdate: (file: TUploadFile, newId?: string) => void,
      category?: CaseFileCategory,
      policeCaseNumber?: string,
    ) => {
      handleUIUpdate({
        name: file.name,
        id: file.id,
        percent: 1,
        status: 'uploading',
        type: file.type,
        category,
        policeCaseNumber,
      })
      upload(
        [
          [
            {
              name: file.name,
              type: file.type ?? '',
              size: file.size,
            } as File,
            file.id ?? file.name,
          ],
        ],
        handleUIUpdate,
        category,
        policeCaseNumber,
      )
    },
    [upload],
  )

  const handleRemove = useCallback(
    async (file: UploadFile, cb?: (file: UploadFile) => void) => {
      try {
        if (file.id) {
          const { data } = await remove(file.id)

          const success = limitedAccess
            ? (data as LimitedAccessDeleteFileMutation)?.limitedAccessDeleteFile
                .success
            : (data as DeleteFileMutation)?.deleteFile.success

          if (!success) {
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
    [formatMessage, limitedAccess, remove],
  )

  const generateSingleFileUpdate = useCallback(
    (prevFiles: UploadFile[], displayFile: UploadFile, newId?: string) => {
      const index = prevFiles.findIndex((f) => f.id === displayFile.id)

      if (index === -1) {
        return prevFiles
      }

      const displayFileWithId = {
        ...displayFile,
        id: newId ?? displayFile.id,
      }
      const next = [...prevFiles]
      next[index] = displayFileWithId
      return next
    },
    [],
  )

  return {
    upload,
    uploadFromPolice,
    remove,
    handleRetry,
    handleRemove,
    handleChange,
    generateSingleFileUpdate,
  }
}

export default useS3Upload
