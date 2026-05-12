'use client'

import { useState, useReducer, useCallback, useEffect, useRef } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import type { FileRejection } from 'react-dropzone'
import { Box } from '@island.is/island-ui/core'
import {
  InputFileUploadDeprecated,
  type UploadFileDeprecated,
  fileToObjectDeprecated,
} from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { coreErrorMessages } from '@island.is/application/core'
import {
  CREATE_UPLOAD_URL,
  ADD_ATTACHMENT,
  DELETE_ATTACHMENT,
  GET_MALWARE_SCAN_STATUS,
} from '@island.is/application/graphql'
import { useLocale } from '@island.is/localization'
import { MalwareScanStatus } from '@island.is/shared/types'

import { useApplicationId } from '../../ApplicationContext'
import { SDF_FIELD_CONTROL_PADDING_TOP } from '../../sdfLayoutTokens'
import type { FieldRendererProps } from '../types'

const DEFAULT_TOTAL_MAX_SIZE = 100_000_000

type FileAnswer = { name: string; key?: string }

enum FileActionType {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  UPDATE = 'UPDATE',
}

type FileAction =
  | { type: FileActionType.ADD; payload: { newFiles: UploadFileDeprecated[] } }
  | {
      type: FileActionType.REMOVE
      payload: { fileToRemove: UploadFileDeprecated }
    }
  | {
      type: FileActionType.UPDATE
      payload: {
        file: UploadFileDeprecated
        status: UploadFileDeprecated['status']
        percent: number
        key?: string
      }
    }

const fileReducer = (
  state: UploadFileDeprecated[],
  action: FileAction,
): UploadFileDeprecated[] => {
  switch (action.type) {
    case FileActionType.ADD:
      return state.concat(action.payload.newFiles)
    case FileActionType.REMOVE:
      return state.filter(
        (file) => file.name !== action.payload.fileToRemove.name,
      )
    case FileActionType.UPDATE:
      return state.map((file) => {
        if (file.name === action.payload.file.name) {
          return {
            ...file,
            status: action.payload.status,
            percent: action.payload.percent,
            key: action.payload.key ?? file.key,
          }
        }
        return file
      })
    default:
      return state
  }
}

const answerToUploadFile = (entry: FileAnswer): UploadFileDeprecated => ({
  name: entry.name,
  key: entry.key,
  status: 'done',
})

const toFileAnswerArray = (value: unknown): FileAnswer[] => {
  if (!Array.isArray(value)) return []
  return value.filter((entry): entry is FileAnswer => {
    if (typeof entry !== 'object' || entry === null) return false
    const candidate = entry as Record<string, unknown>
    return typeof candidate.name === 'string'
  })
}

const uploadFileToS3 = (
  file: UploadFileDeprecated,
  dispatch: React.Dispatch<FileAction>,
  uploadUrl: string,
  fields: Record<string, string>,
): Promise<{ url: string }> =>
  new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()

    const handleError = () => {
      dispatch({
        type: FileActionType.UPDATE,
        payload: { file, status: 'error', percent: 0 },
      })
      reject(req.response)
    }

    req.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100)
        dispatch({
          type: FileActionType.UPDATE,
          payload: {
            file,
            status: 'uploading',
            percent: Math.min(percent, 99),
          },
        })
      }
    })

    req.onload = () => {
      if (req.status !== 200 && req.status !== 204) {
        handleError()
        return
      }
      resolve({ url: uploadUrl })
    }

    req.addEventListener('error', handleError)
    req.upload.addEventListener('error', handleError)

    const form = new FormData()
    Object.keys(fields).forEach((key) => form.append(key, fields[key]))
    if (file.originalFileObj) {
      form.append('file', file.originalFileObj)
    }

    req.open('POST', uploadUrl, true)
    req.send(form)
  })

export const SdfFileUploadField = ({
  component,
  currentValue,
  error,
  handleChange,
}: FieldRendererProps) => {
  const applicationId = useApplicationId()
  const { formatMessage } = useLocale()
  const fieldId = component.id ?? ''
  const multiple = component.uploadMultiple ?? false
  const totalMaxSize = component.totalMaxSize ?? DEFAULT_TOTAL_MAX_SIZE
  const maxFileCount = component.maxFileCount ?? Number.MAX_SAFE_INTEGER

  const initialFiles = toFileAnswerArray(currentValue).map(answerToUploadFile)

  const [state, dispatch] = useReducer(fileReducer, initialFiles)
  const [uploadError, setUploadError] = useState<string | undefined>()
  const [sumOfFileSizes, setSumOfFileSizes] = useState(0)
  const [sumOfFileCount, setSumOfFileCount] = useState(initialFiles.length)

  const [createUploadUrl] = useMutation(CREATE_UPLOAD_URL)
  const [addAttachment] = useMutation(ADD_ATTACHMENT)
  const [deleteAttachment] = useMutation(DELETE_ATTACHMENT)
  const { refetch: fileUploadMalwareStatus } = useQuery(
    GET_MALWARE_SCAN_STATUS,
    { skip: true },
  )

  const prevAnswerRef = useRef<FileAnswer[]>([])

  useEffect(() => {
    const doneFiles = state.filter(
      (f: UploadFileDeprecated) => f.key && f.status === 'done',
    )
    const nextAnswer: FileAnswer[] = doneFiles.map((f) => ({
      name: f.name,
      key: f.key,
    }))

    const prev = prevAnswerRef.current
    const changed =
      prev.length !== nextAnswer.length ||
      prev.some(
        (p, i) =>
          p.name !== nextAnswer[i]?.name || p.key !== nextAnswer[i]?.key,
      )

    if (changed) {
      prevAnswerRef.current = nextAnswer
      handleChange(nextAnswer)
    }
  }, [state, handleChange])

  const isFreeOfMalware = useCallback(
    async (fileKey: string): Promise<boolean> => {
      const { data } = await fileUploadMalwareStatus({ filename: fileKey })
      const status = data?.malwareScanStatus ?? MalwareScanStatus.UNKNOWN
      return status !== undefined && status === MalwareScanStatus.SAFE
    },
    [fileUploadMalwareStatus],
  )

  const handleUploadFlow = useCallback(
    async (file: UploadFileDeprecated) => {
      const { data } = await createUploadUrl({
        variables: { filename: file.name },
      })
      const {
        createUploadUrl: { url, fields },
      } = data
      const response = await uploadFileToS3(file, dispatch, url, fields)
      const responseUrl = `${response.url}/${fields.key}`

      await addAttachment({
        variables: {
          input: { id: applicationId, key: fields.key, url: responseUrl },
        },
      })

      const isClean = await isFreeOfMalware(fields.key)
      return { key: fields.key as string, url: responseUrl, isClean }
    },
    [createUploadUrl, addAttachment, applicationId, isFreeOfMalware],
  )

  const handleRemoveFile = useCallback(
    async (
      fileToRemove: UploadFileDeprecated,
      overwriteError = true,
      removeFileCard = true,
    ) => {
      if (fileToRemove.key) {
        try {
          await deleteAttachment({
            variables: {
              input: { id: applicationId, key: fileToRemove.key },
            },
          })
        } catch {
          setUploadError(formatMessage(coreErrorMessages.fileRemove))
          return
        }
      }

      if (removeFileCard) {
        dispatch({
          type: FileActionType.REMOVE,
          payload: { fileToRemove },
        })
        setSumOfFileCount((prev) => prev - 1)
      }

      if (overwriteError) setUploadError(undefined)
    },
    [deleteAttachment, applicationId, formatMessage],
  )

  const handleFileChange = useCallback(
    async (newFiles: File[], uploadCount?: number) => {
      setUploadError(undefined)

      if (!multiple) {
        if (uploadCount && uploadCount > 1) {
          setUploadError(
            formatMessage(coreErrorMessages.uploadMultipleNotAllowed),
          )
          return
        }
        if (state.length === 1) {
          await handleRemoveFile(state[0])
        }
      }

      const addedUniqueFiles = newFiles.filter((newFile) =>
        state.every((existing) => existing.name !== newFile.name),
      )
      if (addedUniqueFiles.length === 0) return

      const totalNewFileSize = addedUniqueFiles.reduce(
        (sum, f) => sum + f.size,
        0,
      )

      if (totalNewFileSize + sumOfFileSizes > totalMaxSize) {
        setUploadError(
          formatMessage(coreErrorMessages.fileMaxSumSizeLimitExceeded, {
            maxSizeInMb: totalMaxSize / 1_000_000,
          }),
        )
        return
      }

      if (sumOfFileCount + addedUniqueFiles.length > maxFileCount) {
        setUploadError(
          formatMessage(coreErrorMessages.fileMaxCountLimitExceeded, {
            maxFileCount,
          }),
        )
        return
      }

      setSumOfFileSizes((prev) => prev + totalNewFileSize)
      setSumOfFileCount((prev) => prev + addedUniqueFiles.length)

      const newUploadFiles = addedUniqueFiles.map((f) =>
        fileToObjectDeprecated(f, 'uploading'),
      )

      dispatch({
        type: FileActionType.ADD,
        payload: { newFiles: newUploadFiles },
      })

      const malwareFiles: UploadFileDeprecated[] = []

      const uploadPromises = newUploadFiles.map(async (f) => {
        try {
          const res = await handleUploadFlow(f)

          if (!res.isClean) {
            if (res.key) f.key = res.key
            malwareFiles.push(f)
          }

          dispatch({
            type: FileActionType.UPDATE,
            payload: {
              file: f,
              status: res.isClean ? 'done' : 'error',
              percent: 100,
              key: res.key,
            },
          })
        } catch {
          setUploadError(formatMessage(coreErrorMessages.fileUpload))
        }
      })

      await Promise.allSettled(uploadPromises)

      if (malwareFiles.length > 0) {
        const names = malwareFiles.map((f) => f.name).join(', ')
        for (const f of malwareFiles) {
          await handleRemoveFile(f, false, false)
        }
        setUploadError(
          formatMessage(coreErrorMessages.fileUploadMalware, { files: names }),
        )
      }
    },
    [
      multiple,
      state,
      sumOfFileSizes,
      sumOfFileCount,
      totalMaxSize,
      maxFileCount,
      formatMessage,
      handleRemoveFile,
      handleUploadFlow,
    ],
  )

  const handleFileRejection = useCallback(
    (files: FileRejection[]) => {
      files.forEach((file) => {
        if (component.maxSize && file.file.size > component.maxSize) {
          const maxSizeInMb = component.maxSize / 1_000_000
          setUploadError(
            component.maxSizeErrorText ??
              formatMessage(coreErrorMessages.fileMaxSizeLimitExceeded, {
                maxSizeInMb,
              }),
          )
          return
        }
        if (component.accept) {
          const acceptedExtensions = component.accept.split(',')
          if (!acceptedExtensions.includes(file.file.type)) {
            setUploadError(
              formatMessage(coreErrorMessages.fileInvalidExtension, {
                accept: component.accept,
              }),
            )
          }
        }
      })
    },
    [
      component.maxSize,
      component.maxSizeErrorText,
      component.accept,
      formatMessage,
    ],
  )

  return (
    <Box marginBottom={3}>
      {component.introduction && (
        <FieldDescription description={component.introduction} />
      )}
      <Box paddingTop={SDF_FIELD_CONTROL_PADDING_TOP}>
        <InputFileUploadDeprecated
          id={fieldId}
          fileList={state}
          header={component.uploadHeader}
          description={component.uploadDescription}
          buttonLabel={component.uploadButtonLabel}
          onChange={handleFileChange}
          onRemove={handleRemoveFile}
          onUploadRejection={handleFileRejection}
          errorMessage={uploadError ?? error}
          multiple={multiple}
          accept={component.accept}
          maxSize={component.maxSize}
        />
      </Box>
    </Box>
  )
}
