import { useCallback, useContext } from 'react'
import { useMutation } from '@apollo/client'
import { useIntl } from 'react-intl'
import { uuid } from 'uuidv4'

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
  LimitedAccessCreateFileMutationDocument,
  LimitedAccessCreateFileMutationMutation,
  LimitedAccessCreateFileMutationMutationVariables,
  LimitedAccessCreatePresignedPostMutationDocument,
  LimitedAccessCreatePresignedPostMutationMutation,
  LimitedAccessCreatePresignedPostMutationMutationVariables,
  LimitedAccessDeleteFileMutationDocument,
  LimitedAccessDeleteFileMutationMutation,
  LimitedAccessDeleteFileMutationMutationVariables,
  PresignedPost,
  UploadPoliceCaseFileMutationDocument,
  UploadPoliceCaseFileMutationMutation,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { errors } from '@island.is/judicial-system-web/messages'
import { UserContext } from '@island.is/judicial-system-web/src/components'

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
  const { limitedAccess } = useContext(UserContext)
  const { formatMessage } = useIntl()

  const [createPresignedPostMutation] = useMutation<
    CreatePresignedPostMutationMutation,
    CreatePresignedPostMutationMutationVariables
  >(CreatePresignedPostMutationDocument)
  const [limitedAccessCreatePresignedPostMutation] = useMutation<
    LimitedAccessCreatePresignedPostMutationMutation,
    LimitedAccessCreatePresignedPostMutationMutationVariables
  >(LimitedAccessCreatePresignedPostMutationDocument)
  const [createFileMutation] = useMutation<
    CreateFileMutationMutation,
    CreateFileMutationMutationVariables
  >(CreateFileMutationDocument)
  const [limitedAccessCreateFileMutation] = useMutation<
    LimitedAccessCreateFileMutationMutation,
    LimitedAccessCreateFileMutationMutationVariables
  >(LimitedAccessCreateFileMutationDocument)
  const [deleteFileMutation] = useMutation<
    DeleteFileMutationMutation,
    DeleteFileMutationMutationVariables
  >(DeleteFileMutationDocument)
  const [limitedAccessDeleteFileMutation] = useMutation<
    LimitedAccessDeleteFileMutationMutation,
    LimitedAccessDeleteFileMutationMutationVariables
  >(LimitedAccessDeleteFileMutationDocument)
  const [
    uploadPoliceCaseFileMutation,
  ] = useMutation<UploadPoliceCaseFileMutationMutation>(
    UploadPoliceCaseFileMutationDocument,
  )

  const upload = useCallback(
    async (
      files: Array<[File, string]>,
      handleUIUpdate: (file: TUploadFile, newId?: string) => void,
      category?: CaseFileCategory,
      policeCaseNumber?: string,
    ) => {
      const mutation = limitedAccess
        ? limitedAccessCreatePresignedPostMutation
        : createPresignedPostMutation

      const createPresignedPost = async (file: File) => {
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
          ? (data as LimitedAccessCreatePresignedPostMutationMutation)
              ?.limitedAccessCreatePresignedPost
          : (data as CreatePresignedPostMutationMutation)?.createPresignedPost

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
        const mutation = limitedAccess
          ? limitedAccessCreateFileMutation
          : createFileMutation

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
          ? (data as LimitedAccessCreateFileMutationMutation)
              ?.limitedAccessCreateFile
          : (data as CreateFileMutationMutation)?.createFile

        if (!createdFile?.id) {
          throw Error('failed to add file to case')
        }

        return createdFile.id
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
    [
      limitedAccess,
      limitedAccessCreatePresignedPostMutation,
      createPresignedPostMutation,
      caseId,
      limitedAccessCreateFileMutation,
      createFileMutation,
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
          }),
        ),
        ...previous,
      ])
      upload(filesWithId, cb, category, policeCaseNumber)
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

        const data2 = await createFileMutation({
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
    [createFileMutation, caseId, formatMessage, uploadPoliceCaseFileMutation],
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
        ? limitedAccessDeleteFileMutation({
            variables,
            optimisticResponse: { limitedAccessDeleteFile: resopnse },
          })
        : deleteFileMutation({
            variables,
            optimisticResponse: { deleteFile: resopnse },
          })
    },
    [
      caseId,
      limitedAccess,
      limitedAccessDeleteFileMutation,
      deleteFileMutation,
    ],
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
          const { data } = await remove(file.id)

          const success = limitedAccess
            ? (data as LimitedAccessDeleteFileMutationMutation)
                ?.limitedAccessDeleteFile.success
            : (data as DeleteFileMutationMutation)?.deleteFile.success

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
