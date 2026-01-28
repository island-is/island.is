import { useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { v4 as uuid } from 'uuid'

import { FileUploadStatus, toast, UploadFile } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { UserContext } from '@island.is/judicial-system-web/src/components'
import { FileWithPreviewURL } from '@island.is/judicial-system-web/src/components/UploadFiles/UploadFiles'
import {
  CaseFile,
  CaseFileCategory,
  CreateFileInput,
  Defendant,
  PresignedPost,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { api } from '@island.is/judicial-system-web/src/services'

import {
  CreateCivilClaimantFileMutation,
  useCreateCivilClaimantFileMutation,
} from './createCivilClaimantFile.generated'
import {
  CreateDefendantFileMutation,
  useCreateDefendantFileMutation,
} from './createDefendantFile.generated'
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
  LimitedAccessCreateCivilClaimantFileMutation,
  useLimitedAccessCreateCivilClaimantFileMutation,
} from './limitedAccessCreateCivilClaimantFile.generated'
import {
  LimitedAccessCreateDefendantFileMutation,
  useLimitedAccessCreateDefendantFileMutation,
} from './limitedAccessCreateDefendantFile.generated'
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
import { useUploadCriminalRecordFileMutation } from './uploadCriminalRecordFile.generated'
import { useUploadPoliceCaseFileMutation } from './uploadPoliceCaseFile.generated'
import { strings } from './useS3Upload.strings'

// - rewrite upload from police
// - more granular retry
export interface TUploadFile extends UploadFile {
  category?: CaseFileCategory | null
  policeCaseNumber?: string | null
  chapter?: number | null
  orderWithinChapter?: number | null
  displayDate?: string | null
  policeFileId?: string | null
  userGeneratedFilename?: string | null
  submissionDate?: string | null
  fileRepresentative?: string | null
  previewUrl?: string | null
  isKeyAccessible?: boolean | null
  defendantId?: string | null
  civilClaimantId?: string | null // TODO: Do we need this?
}

export interface UploadFileState {
  isUploading: boolean
  error: boolean
}

const mapCaseFileToUploadFile = (file: CaseFile): TUploadFile => ({
  id: file.id,
  name: file.name ?? '',
  size: file.size ?? undefined,
  key: file.key ?? undefined,
  percent: 100,
  status: FileUploadStatus.done,
  category: file.category,
  policeCaseNumber: file.policeCaseNumber,
  chapter: file.chapter,
  orderWithinChapter: file.orderWithinChapter,
  displayDate: file.displayDate,
  policeFileId: file.policeFileId,
  userGeneratedFilename: file.userGeneratedFilename,
  submissionDate: file.submissionDate,
  fileRepresentative: file.fileRepresentative,
  isKeyAccessible: file.isKeyAccessible,
})

export const useUploadFiles = (files?: CaseFile[] | null) => {
  const [uploadFiles, setUploadFiles] = useState<TUploadFile[]>(
    files?.map(mapCaseFileToUploadFile) ?? [],
  )

  useEffect(() => {
    setUploadFiles(files?.map(mapCaseFileToUploadFile) ?? [])
  }, [files])

  const allFilesDoneOrError = uploadFiles.every(
    (file) =>
      file.status === FileUploadStatus.done ||
      file.status === FileUploadStatus.error,
  )

  const someFilesError = uploadFiles.some(
    (file) => file.status === FileUploadStatus.error,
  )

  const addUploadFile = (file: TUploadFile) =>
    setUploadFiles((previous) => [file, ...previous])

  const addUploadFiles = (
    files: FileWithPreviewURL[],
    overRides?: Partial<TUploadFile>,
    setUserGeneratedFilename = false,
  ) => {
    // We generate an id for each file so that we find the file again when
    // updating the file's progress and onRetry.
    // Also we cannot spread File since it contains read-only properties.
    const uploadFiles: TUploadFile[] = files.map((file) => ({
      id: `${file.name}-${uuid()}`,
      name: file.name,
      type: file.type,
      size: file.size,
      percent: 0,
      originalFileObj: file,
      userGeneratedFilename: setUserGeneratedFilename ? file.name : undefined,
      previewUrl: file.previewUrl,
      ...overRides,
    }))

    setUploadFiles((previous) => [...uploadFiles, ...previous])

    return uploadFiles
  }

  const updateUploadFile = (file: TUploadFile, newId?: string) => {
    setUploadFiles((previous) =>
      previous.map((f) =>
        f.id === file.id ? { ...f, ...file, id: newId ?? file.id } : f,
      ),
    )
  }

  const removeUploadFile = (file: TUploadFile) =>
    setUploadFiles((previous) =>
      previous.filter((caseFile) => caseFile.id !== file.id),
    )

  return {
    uploadFiles,
    allFilesDoneOrError,
    someFilesError,
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

const useS3Upload = (
  caseId: string,
  defendantId?: string,
  civilClaimantId?: string,
) => {
  const { limitedAccess } = useContext(UserContext)
  const { formatMessage } = useIntl()

  const [createPresignedPost] = useCreatePresignedPostMutation()
  const [limitedAccessCreatePresignedPost] =
    useLimitedAccessCreatePresignedPostMutation()
  const [createFile] = useCreateFileMutation()
  const [limitedAccessCreateFile] = useLimitedAccessCreateFileMutation()
  const [createDefendantFile] = useCreateDefendantFileMutation()
  const [limitedAccessCreateDefendantFile] =
    useLimitedAccessCreateDefendantFileMutation()
  const [createCivilClaimantFile] = useCreateCivilClaimantFileMutation()
  const [limitedAccessCreateCivilClaimantFile] =
    useLimitedAccessCreateCivilClaimantFileMutation()
  const [deleteFile] = useDeleteFileMutation()
  const [limitedAccessDeleteFile] = useLimitedAccessDeleteFileMutation()
  const [uploadPoliceCaseFile] = useUploadPoliceCaseFileMutation()
  const [uploadCriminalRecordFile] = useUploadCriminalRecordFileMutation()

  const getPresignedPost = useCallback(
    async (file: TUploadFile) => {
      const mutation = limitedAccess
        ? limitedAccessCreatePresignedPost
        : createPresignedPost

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
    },
    [
      limitedAccess,
      limitedAccessCreatePresignedPost,
      createPresignedPost,
      caseId,
    ],
  )

  const addFileToCaseState = useCallback(
    async (file: TUploadFile) => {
      const addCaseFileToCaseState = async (input: CreateFileInput) => {
        const mutation = limitedAccess ? limitedAccessCreateFile : createFile

        const { data } = await mutation({ variables: { input } })

        const createdFile = limitedAccess
          ? (data as LimitedAccessCreateFileMutation)?.limitedAccessCreateFile
          : (data as CreateFileMutation)?.createFile

        if (!createdFile?.id) {
          throw Error('Failed to add file to case')
        }

        return createdFile.id
      }

      const addDefendantFileToCaseState = async (
        input: CreateFileInput,
        defendantId: string,
      ) => {
        const mutation = limitedAccess
          ? limitedAccessCreateDefendantFile
          : createDefendantFile

        const { data } = await mutation({
          variables: { input: { ...input, defendantId } },
        })

        const createdFile = limitedAccess
          ? (data as LimitedAccessCreateDefendantFileMutation)
              ?.limitedAccessCreateDefendantFile
          : (data as CreateDefendantFileMutation)?.createDefendantFile

        if (!createdFile?.id) {
          throw Error('Failed to add file to case')
        }

        return createdFile.id
      }

      const addCivilClaimantFileToCaseState = async (
        input: CreateFileInput,
        civilClaimantId: string,
      ) => {
        const mutation = limitedAccess
          ? limitedAccessCreateCivilClaimantFile
          : createCivilClaimantFile

        const { data } = await mutation({
          variables: { input: { ...input, civilClaimantId } },
        })

        const createdFile = limitedAccess
          ? (data as LimitedAccessCreateCivilClaimantFileMutation)
              ?.limitedAccessCreateCivilClaimantFile
          : (data as CreateCivilClaimantFileMutation)?.createCivilClaimantFile

        if (!createdFile?.id) {
          throw Error('Failed to add file to case')
        }

        return createdFile.id
      }

      const baseInput = {
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
        userGeneratedFilename: file.userGeneratedFilename,
        submissionDate: file.submissionDate,
        fileRepresentative: file.fileRepresentative,
        isKeyAccessible: file.isKeyAccessible,
      }

      // Check file's defendantId first (for criminal records), then fall back to hook parameter
      const fileDefendantId = file.defendantId ?? defendantId
      if (fileDefendantId) {
        return addDefendantFileToCaseState(baseInput, fileDefendantId)
      }

      // Check file's civilClaimantId first, then fall back to hook parameter
      const fileCivilClaimantId = file.civilClaimantId ?? civilClaimantId
      if (fileCivilClaimantId) {
        return addCivilClaimantFileToCaseState(baseInput, fileCivilClaimantId)
      }

      return addCaseFileToCaseState(baseInput)
    },
    [
      caseId,
      defendantId,
      civilClaimantId,
      limitedAccess,
      limitedAccessCreateFile,
      createFile,
      limitedAccessCreateDefendantFile,
      createDefendantFile,
      limitedAccessCreateCivilClaimantFile,
      createCivilClaimantFile,
    ],
  )

  const handleUpload = useCallback(
    async (
      files: TUploadFile[],
      updateFile: (file: TUploadFile, newId?: string) => void,
    ) => {
      const promises = files.map(async (file) => {
        try {
          updateFile({ ...file, status: FileUploadStatus.uploading })

          const presignedPost = await getPresignedPost(file)

          await uploadToS3(file, presignedPost, (percent) => {
            updateFile({ ...file, percent })
          })

          const newFileId = await addFileToCaseState({
            ...file,
            key: presignedPost.key,
          })

          updateFile(
            {
              ...file,
              key: presignedPost.key,
              percent: 100,
              status: FileUploadStatus.done,
            },
            // We need to set the id so we are able to delete the file later
            newFileId,
          )

          return true
        } catch (e) {
          toast.error(formatMessage(strings.uploadFailed))
          updateFile({ ...file, percent: 0, status: FileUploadStatus.error })

          return false
        }
      })

      return Promise.all(promises).then((results) => {
        if (results.every((result) => result)) {
          return 'ALL_SUCCEEDED'
        }

        if (results.some((result) => result)) {
          return 'SOME_SUCCEEDED'
        }

        return 'NONE_SUCCEEDED'
      })
    },
    [getPresignedPost, addFileToCaseState, formatMessage],
  )

  const handleUploadCriminalRecord = (
    defendants: Defendant[],
    addUploadFile: (file: TUploadFile) => void,
    updateFile: (file: TUploadFile, newId?: string) => void,
  ) => {
    const promises = defendants.map(
      async ({ id, name: defendantName, nationalId, noNationalId }) => {
        const currentDate = formatDate(new Date())
        const name = `Sakavottord${
          nationalId ? `_${nationalId}_${currentDate}` : ''
        }.pdf`
        const commonFileProps = {
          // add a temp name for error handling
          id: `${name}-${uuid()}`,
          name,
          category: CaseFileCategory.CRIMINAL_RECORD,
          status: FileUploadStatus.uploading,
          percent: 0,
        }

        if (!noNationalId) {
          addUploadFile(commonFileProps)
        }

        try {
          // TEMP: this is a temp step while we incorporate required token handling
          // for criminal record endpoint asa middleware
          const { success } = await api.prepareRequest()
          if (!success) {
            throw Error('Failed to prepare upload criminal record request')
          }
          // fetch criminal record and upload it to S3 in the backend
          const { data: criminalRecordFile } = await uploadCriminalRecordFile({
            variables: {
              input: { caseId, defendantId: id },
            },
          })
          if (!criminalRecordFile) {
            throw Error('Failed to upload criminal record to S3')
          }

          const fileProps = {
            ...commonFileProps,
            name: criminalRecordFile.uploadCriminalRecordFile.name,
            key: criminalRecordFile.uploadCriminalRecordFile.key,
            size: criminalRecordFile.uploadCriminalRecordFile.size,
            type: criminalRecordFile.uploadCriminalRecordFile.type,
            defendantId: id,
          }
          // create the case file in the backend
          const fileId = await addFileToCaseState(fileProps)

          // update the client state with the newly fetched file
          updateFile(
            {
              ...fileProps,
              percent: 100,
              status: FileUploadStatus.done,
            },
            fileId,
          )
        } catch (error) {
          if (noNationalId) {
            toast.error(`Ákærði: ${defendantName} er ekki með kennitölu`)
          } else {
            toast.error(formatMessage(strings.uploadFailed))
            updateFile({
              ...commonFileProps,
              percent: 0,
              status: FileUploadStatus.error,
            })
          }
        }
      },
    )
    return Promise.all(promises)
  }

  const handleUploadFromPolice = useCallback(
    (
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
                status: FileUploadStatus.done,
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
      callback({ ...file, percent: 1, status: FileUploadStatus.uploading })

      return handleUpload([file], callback)
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
      const response: { success: boolean; __typename: 'DeleteFileResponse' } = {
        success: true,
        __typename: 'DeleteFileResponse',
      }

      return limitedAccess
        ? limitedAccessDeleteFile({
            variables,
            optimisticResponse: { limitedAccessDeleteFile: response },
          })
        : deleteFile({
            variables,
            optimisticResponse: { deleteFile: response },
          })
    },
    [caseId, limitedAccess, limitedAccessDeleteFile, deleteFile],
  )

  const handleRemove = useCallback(
    async (file: TUploadFile, callback?: (file: TUploadFile) => void) => {
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

          callback && callback(file)
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
    handleUploadCriminalRecord,
  }
}

export default useS3Upload
