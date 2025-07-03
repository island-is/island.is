import { useState, useReducer, useEffect } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { useMutation, useQuery } from '@apollo/client'
import { FileRejection } from 'react-dropzone'

import { getValueViaPath, coreErrorMessages } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  InputFileUploadDeprecated,
  UploadFileDeprecated,
  fileToObjectDeprecated,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  CREATE_UPLOAD_URL,
  ADD_ATTACHMENT,
  DELETE_ATTACHMENT,
  GET_MALWARE_SCAN_STATUS,
} from '@island.is/application/graphql'

import { Action, ActionTypes } from './types'
import { InputImageUpload } from '../../components/InputImageUpload/InputImageUpload'
import { DEFAULT_TOTAL_MAX_SIZE, uploadFileToS3 } from './utils'
import { MalwareScanStatus } from '@island.is/shared/types'

type UploadFileAnswer = {
  name: string
  key?: string
}

// Transform an uploaded file to an form answer.
const transformToAnswer = ({
  name,
  key,
}: UploadFileDeprecated): UploadFileAnswer => {
  return { name, key }
}

// Transform an form answer to an uploaded file object to display.
const answerToUploadFile = ({
  name,
  key,
}: UploadFileDeprecated): UploadFileDeprecated => {
  return { name, key, status: 'done' }
}

const reducer = (state: UploadFileDeprecated[], action: Action) => {
  switch (action.type) {
    case ActionTypes.ADD:
      return state.concat(action.payload.newFiles)

    case ActionTypes.REMOVE:
      return state.filter(
        (file) => file.name !== action.payload.fileToRemove.name,
      )

    case ActionTypes.UPDATE:
      return state.map((file: UploadFileDeprecated) => {
        if (file.name === action.payload.file.name) {
          file.status = action.payload.status
          file.percent = action.payload.percent
          file.key = action.payload.key
        }
        return file
      })

    default:
      return state
  }
}

interface FileUploadControllerProps {
  readonly id: string
  error?: string
  application: Application
  onRemove?: (f: UploadFileDeprecated) => void
  readonly header?: string
  readonly description?: string
  readonly buttonLabel?: string
  readonly multiple?: boolean
  readonly accept?: string
  readonly maxSize?: number
  readonly maxSizeErrorText?: string
  readonly totalMaxSize?: number
  readonly maxFileCount?: number
  readonly forImageUpload?: boolean
}

export const FileUploadController = ({
  id,
  error,
  application,
  header,
  description,
  buttonLabel,
  multiple,
  accept,
  maxSize,
  maxSizeErrorText,
  totalMaxSize = DEFAULT_TOTAL_MAX_SIZE,
  maxFileCount = Number.MAX_SAFE_INTEGER, // Default to no limit
  forImageUpload,
  onRemove,
}: FileUploadControllerProps) => {
  const { formatMessage } = useLocale()
  const { clearErrors, setValue } = useFormContext()
  const [uploadError, setUploadError] = useState<string | undefined>(error)
  const val = getValueViaPath<UploadFileDeprecated[]>(
    application.answers,
    id,
    [],
  )
  const [createUploadUrl] = useMutation(CREATE_UPLOAD_URL)
  const [addAttachment] = useMutation(ADD_ATTACHMENT)
  const [deleteAttachment] = useMutation(DELETE_ATTACHMENT)
  const { refetch: fileUploadMalwareStatus } = useQuery(
    GET_MALWARE_SCAN_STATUS,
    { skip: true },
  )
  const [sumOfFileSizes, setSumOfFileSizes] = useState(0)

  const initialUploadFiles: UploadFileDeprecated[] =
    (val && val.map((f) => answerToUploadFile(f))) || []
  const [state, dispatch] = useReducer(reducer, initialUploadFiles)

  const [sumOfFileCount, setSumOfFileCount] = useState(
    initialUploadFiles?.length ?? 0,
  )

  useEffect(() => {
    const onlyUploadedFiles = state.filter(
      (f: UploadFileDeprecated) => f.key && f.status === 'done',
    )

    const uploadAnswer: UploadFileAnswer[] =
      onlyUploadedFiles.map(transformToAnswer)

    setValue(id, uploadAnswer)
  }, [state, id, setValue])

  const isFreeOfMalware = async (fileKey: string): Promise<boolean> => {
    const { data } = await fileUploadMalwareStatus({ filename: fileKey })
    const status = data?.malwareScanStatus ?? MalwareScanStatus.UNKNOWN
    return status !== undefined && status === MalwareScanStatus.SAFE
  }

  const uploadFileFlow = async (file: UploadFileDeprecated) => {
    try {
      // 1. Get the upload URL
      const { data } = await createUploadUrl({
        variables: {
          filename: file.name,
        },
      })

      // 2. Upload the file to S3
      const {
        createUploadUrl: { url, fields },
      } = data

      const response = await uploadFileToS3(file, dispatch, url, fields)
      const responseUrl = `${response.url}/${fields.key}`

      // 3. Add Attachment Data
      await addAttachment({
        variables: {
          input: {
            id: application.id,
            key: fields.key,
            url: responseUrl,
          },
        },
      })

      const isClean = await isFreeOfMalware(fields.key)

      // Done!
      return Promise.resolve({ key: fields.key, url: responseUrl, isClean })
    } catch (e) {
      console.error(`Error with FileUploadController ${e}`)
      setUploadError(formatMessage(coreErrorMessages.fileUpload))
      return Promise.reject()
    }
  }

  const onFileChange = async (newFiles: File[], uploadCount?: number) => {
    clearErrors(id)
    setUploadError(undefined)

    if (!multiple) {
      // Trying to upload more than 1 file
      if (uploadCount && uploadCount > 1) {
        setUploadError(
          formatMessage(coreErrorMessages.uploadMultipleNotAllowed),
        )
        return
      }
      // Trying to upload a single file, but a file has already been uploaded
      if (state.length === 1) {
        await onRemoveFile(state[0])
      }
    }

    const addedUniqueFiles = newFiles.filter((newFile: File) => {
      let isUnique = true
      state.forEach((uploadedFile: UploadFileDeprecated) => {
        if (uploadedFile.name === newFile.name) isUnique = false
      })
      return isUnique
    })

    if (addedUniqueFiles.length === 0) return

    const totalNewFileSize = addedUniqueFiles
      .map((f) => f.size)
      .reduce((a, b) => a + b, 0)

    // Show an error if the sum of the file sizes exceeds totalMaxSize.
    if (totalMaxSize && totalNewFileSize + sumOfFileSizes > totalMaxSize) {
      setUploadError(
        formatMessage(coreErrorMessages.fileMaxSumSizeLimitExceeded, {
          maxSizeInMb: totalMaxSize / 1000000,
        }),
      )
      return
    }

    if (
      maxFileCount &&
      sumOfFileCount + addedUniqueFiles.length > maxFileCount
    ) {
      setUploadError(
        formatMessage(coreErrorMessages.fileMaxCountLimitExceeded, {
          maxFileCount,
        }),
      )
      return
    }

    setSumOfFileSizes(totalNewFileSize + sumOfFileSizes)
    setSumOfFileCount(addedUniqueFiles.length + sumOfFileCount)

    const newUploadFiles = addedUniqueFiles.map((f) =>
      fileToObjectDeprecated(f, 'uploading'),
    )

    // Add the files to the list so that the control presents them
    // with a spinner.
    dispatch({
      type: ActionTypes.ADD,
      payload: {
        newFiles: newUploadFiles,
      },
    })

    const malwareFiles: UploadFileDeprecated[] = []
    const uploadPromises = newUploadFiles.map(async (f) => {
      try {
        const res = await uploadFileFlow(f)

        if (!res.isClean) {
          // We need the file to have the key because we are about to remove it
          // before the dispatch event finishes
          if (res.key) f.key = res.key

          malwareFiles.push(f)
        }
        dispatch({
          type: ActionTypes.UPDATE,
          payload: {
            file: f,
            status: res.isClean ? 'done' : 'error',
            percent: 100,
            key: res.key,
            url: res.url,
          },
        })
      } catch {
        setUploadError(formatMessage(coreErrorMessages.fileUpload))
      }
    })

    await Promise.allSettled(uploadPromises)

    if (malwareFiles.length > 0) {
      const malwareFileNamesFormatted = malwareFiles
        .map((f) => f.name)
        .join(', ')

      for (const f of malwareFiles) {
        await onRemoveFile(f, false, false)
      }
      setUploadError(
        formatMessage(coreErrorMessages.fileUploadMalware, {
          files: malwareFileNamesFormatted,
        }),
      )
    }
  }

  const onRemoveFile = async (
    fileToRemove: UploadFileDeprecated,
    overwriteError = true,
    removeFileCard = true,
  ) => {
    // If it's previously been uploaded, remove it from the application attachment.
    if (fileToRemove.key) {
      try {
        await deleteAttachment({
          variables: {
            input: {
              id: application.id,
              key: fileToRemove.key,
            },
          },
        })
      } catch {
        setUploadError(formatMessage(coreErrorMessages.fileRemove))
        return
      }
    }

    onRemove?.(fileToRemove)

    // There is a case for not removing the file card in the component if
    // it has malware and we want it there to show that those exact files have errors
    if (removeFileCard) {
      // We remove it from the list if: the delete attachment above succeeded,
      // or if the user clicked x for a file that failed to upload and is in
      // an error state.
      dispatch({
        type: ActionTypes.REMOVE,
        payload: {
          fileToRemove,
        },
      })
      setSumOfFileCount(sumOfFileCount - 1)
    }

    if (overwriteError) setUploadError(undefined)
  }

  const onFileRejection = (files: FileRejection[]) => {
    // Check maxsize and display custom error if supplied otherwise use default
    files.forEach((file: FileRejection) => {
      if (maxSize && file.file.size > maxSize) {
        const maxSizeInMb = maxSize / 1000000
        return setUploadError(
          maxSizeErrorText ??
            formatMessage(coreErrorMessages.fileMaxSizeLimitExceeded, {
              maxSizeInMb,
            }),
        )
      }

      // Check whether the file is of the correct type and display an error to the user if not
      if (accept) {
        const acceptedExtensions = accept.split(',')
        const fileType = file.file.type
        if (!acceptedExtensions.includes(fileType)) {
          return setUploadError(
            formatMessage(coreErrorMessages.fileInvalidExtension, {
              accept,
            }),
          )
        }
      }
    })
  }

  const FileUploadComponent = forImageUpload
    ? InputImageUpload
    : InputFileUploadDeprecated

  return (
    <Controller
      name={id}
      defaultValue={initialUploadFiles}
      render={() => (
        <FileUploadComponent
          applicationId={application.id}
          fileList={state}
          header={header}
          description={description}
          buttonLabel={buttonLabel}
          onChange={onFileChange}
          onRemove={onRemoveFile}
          onUploadRejection={onFileRejection}
          errorMessage={uploadError || error}
          multiple={multiple}
          accept={accept}
          maxSize={maxSize}
        />
      )}
    />
  )
}

export default FileUploadController
