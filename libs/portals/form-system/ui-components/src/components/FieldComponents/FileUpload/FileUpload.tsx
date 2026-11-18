import { useMutation } from '@apollo/client'
import { useCallback, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { useLocale } from '@island.is/localization'

import { FormSystemField } from '@island.is/api/schema'
import {
  CREATE_UPLOAD_URL,
  DELETE_FILE,
  STORE_FILE,
} from '@island.is/form-system/graphql'
import {
  FileUploadStatus,
  InputFileUpload,
  UploadFile,
} from '@island.is/island-ui/core'
import {
  ApplicationDispatch,
  ApplicationState,
  getValue,
  uploadToS3,
} from '../../../lib'
import { m } from '../../../lib/messages'
import { Controller, useFormContext } from 'react-hook-form'

interface Props {
  item: FormSystemField
  valueIndex?: number
  hasError?: boolean
  dispatch?: ApplicationDispatch
  state?: Partial<ApplicationState>
}

const normalizeS3Keys = (raw: unknown): string[] => {
  if (Array.isArray(raw)) {
    return raw.filter((k): k is string => typeof k === 'string' && k.length > 0)
  }
  if (typeof raw === 'string' && raw.length > 0) return [raw]
  return []
}

const initializeFiles = (
  item: FormSystemField,
  valueIndex: number,
): UploadFile[] => {
  const s3Keys = normalizeS3Keys(getValue(item, 's3Key', valueIndex))
  if (!s3Keys) {
    return []
  }
  return s3Keys.map((key) => {
    const lastPart = key.split('/').pop() ?? key // "uuid_filename.jpg"
    const filename = lastPart.split('_').slice(1).join('_') // handles underscores in filename
    return {
      id: key,
      name: filename || lastPart,
      status: FileUploadStatus.done,
      key,
    }
  })
}

export const FileUpload = ({
  item,
  valueIndex = 0,
  hasError,
  dispatch,
  state,
}: Props) => {
  const { formatMessage, lang } = useLocale()
  const { control, setValue, trigger, clearErrors } = useFormContext()
  const fieldName = `${item.id}.${valueIndex}`
  const [files, setFiles] = useState<UploadFile[]>(
    initializeFiles(item, valueIndex),
  )
  const filesRef = useRef(files)
  const updateFiles = useCallback((next: UploadFile[]) => {
    filesRef.current = next
    setFiles(next)
  }, [])
  const [error, setError] = useState<string | undefined>(
    hasError ? 'error' : undefined,
  )
  const [createUploadUrl] = useMutation(CREATE_UPLOAD_URL)
  const [uploadFile] = useMutation(STORE_FILE)
  const [deleteFile] = useMutation(DELETE_FILE)

  const applicationId = state?.application?.id

  const types =
    item?.fieldSettings?.fileTypes
      ?.split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && t !== '*') ?? []

  const updateFile = useCallback(
    (id: string, updated: Partial<UploadFile>) => {
      const next = filesRef.current.map((f) =>
        f.id === id ? { ...f, ...updated } : f,
      )
      updateFiles(next)
      return next
    },
    [updateFiles],
  )

  const handleUpload = useCallback(
    async (file: UploadFile, id: string) => {
      if (!applicationId) return

      if (dispatch?.({ type: 'START_FILE_UPLOAD' }) === false) return
      const existing = filesRef.current.some((f) => f.id === id)
      if (existing) {
        updateFile(id, { status: FileUploadStatus.uploading, percent: 0 })
      } else {
        updateFiles([...filesRef.current, file])
      }
      try {
        const { data } = await createUploadUrl({
          variables: { filename: file.name },
        })
        const presigned = data?.createUploadUrl

        if (!presigned?.url || !presigned?.fields) {
          throw new Error('Invalid presigned upload response')
        }

        const progress = (percent: number) => {
          updateFile(id, { percent })
        }

        // Upload to temp bucket
        await uploadToS3(presigned, file, progress)
        // Move from temp to permanent bucket
        await uploadFile({
          variables: {
            input: {
              storeFileDto: {
                fieldId: item.id,
                sourceKey: presigned.fields.key,
                valueId: item.values?.[valueIndex]?.id || '',
              },
            },
          },
        })

        const newKey = `${applicationId}/${presigned.fields.key}`

        const next = updateFile(id, {
          status: FileUploadStatus.done,
          percent: 100,
          key: newKey,
        })

        const nextKeys = next
          .map((f) => f.key)
          .filter((k): k is string => typeof k === 'string' && k.length > 0)

        dispatch?.({
          type: 'SET_FILES',
          payload: { id: item.id, value: nextKeys, valueIndex },
        })

        setValue(fieldName, nextKeys, {
          shouldDirty: true,
          shouldValidate: true,
        })
        await trigger(fieldName)
      } catch (err) {
        updateFile(id, {
          status: FileUploadStatus.error,
          error: formatMessage(m.uploadFailed),
        })
      } finally {
        dispatch?.({ type: 'FINISH_FILE_UPLOAD' })
      }
    },
    [
      createUploadUrl,
      uploadFile,
      item,
      dispatch,
      updateFile,
      updateFiles,
      formatMessage,
      setValue,
      trigger,
      applicationId,
      fieldName,
      valueIndex,
    ],
  )

  const onChange = useCallback(
    (selectedFiles: File[]) => {
      if (state?.isNavigating || state?.submitted) return
      const maxSize = item?.fieldSettings?.fileMaxSize

      if (
        filesRef.current.length + selectedFiles.length >
        (item?.fieldSettings?.maxFiles ?? 1)
      ) {
        clearErrors(fieldName)
        setError(
          `${formatMessage(m.maxFileError)} ${
            item.fieldSettings?.maxFiles ?? 1
          }`,
        )
        return
      }

      if (typeof maxSize === 'number' && maxSize > 0) {
        const tooLarge = selectedFiles.find((f) => f.size > maxSize)
        if (tooLarge) {
          clearErrors(fieldName)
          const maxSizeInMb = Math.round((maxSize / (1024 * 1024)) * 10) / 10
          setError(formatMessage(m.maxSizeInMb, { maxSizeInMb }))
          return
        }
      }

      setError(undefined)

      const uploadFiles: UploadFile[] = selectedFiles.map((file) => {
        const id = uuid()
        return {
          id: `${file.name}-${id}`,
          name: file.name,
          size: file.size,
          type: file.type,
          status: applicationId
            ? FileUploadStatus.uploading
            : FileUploadStatus.done,
          percent: applicationId ? 0 : 100,
          originalFileObj: file,
          key: applicationId ? undefined : `preview/${id}_${file.name}`,
        }
      })

      if (!applicationId) {
        const nextFiles = [...filesRef.current, ...uploadFiles]
        const nextKeys = nextFiles
          .map((file) => file.key)
          .filter(Boolean) as string[]
        updateFiles(nextFiles)
        dispatch?.({
          type: 'SET_FILES',
          payload: { id: item.id, value: nextKeys, valueIndex },
        })
        setValue(fieldName, nextKeys, {
          shouldDirty: true,
          shouldValidate: true,
        })
        trigger(fieldName)
        return
      }

      uploadFiles.forEach((f) => {
        handleUpload(f, f.id as string)
      })
    },
    [
      applicationId,
      state?.isNavigating,
      state?.submitted,
      updateFiles,
      item,
      formatMessage,
      handleUpload,
      clearErrors,
      fieldName,
      valueIndex,
      dispatch,
      setValue,
      trigger,
    ],
  )

  const onRetry = useCallback(
    (file: UploadFile) => {
      if (!applicationId) return

      if (file.originalFileObj && file.id) {
        handleUpload(file, file.id)
      }
    },
    [applicationId, handleUpload],
  )

  const onRemove = useCallback(
    (file: UploadFile) => {
      if (applicationId) {
        deleteFile({
          variables: {
            input: {
              deleteFileDto: {
                key: file.key,
                valueId: item.values?.[valueIndex]?.id,
              },
            },
          },
        })
      }
      const newFiles = filesRef.current.filter(
        (f) => (f.key ?? f.id) !== (file.key ?? file.id),
      )
      updateFiles(newFiles)
      setError(undefined)

      const newKeys = newFiles.map((f) => f.key).filter(Boolean) as string[]
      dispatch?.({
        type: 'SET_FILES',
        payload: { id: item.id, value: newKeys, valueIndex },
      })
      setValue(fieldName, newKeys, { shouldDirty: true, shouldValidate: true })
      trigger(fieldName)
    },
    [
      applicationId,
      deleteFile,
      dispatch,
      updateFiles,
      item.id,
      item.values,
      fieldName,
      valueIndex,
      setValue,
      trigger,
    ],
  )

  const title = item.isRequired
    ? `${item?.name?.[lang] ?? formatMessage(m.uploadBoxTitle)} *`
    : item?.name?.[lang] ?? formatMessage(m.uploadBoxTitle)

  return (
    <Controller
      key={`${item.id}-${valueIndex}`}
      name={fieldName}
      control={control}
      defaultValue={normalizeS3Keys(getValue(item, 's3Key', valueIndex))}
      rules={{
        validate: (v) =>
          !(item.isRequired ?? false) ||
          normalizeS3Keys(v).length > 0 ||
          formatMessage(m.required),
      }}
      render={({ fieldState }) => (
        <InputFileUpload
          name={`fileUpload-${item.id}-${valueIndex}`}
          files={files}
          accept={types}
          title={title}
          description={formatMessage(m.uploadBoxDescription, {
            fileEndings: types.join(', '),
          })}
          buttonLabel={formatMessage(m.uploadBoxButtonLabel)}
          disabled={
            state?.isNavigating ||
            state?.submitted ||
            types.length === 0 ||
            !item.fieldSettings?.fileMaxSize ||
            !item.fieldSettings?.maxFiles
          }
          onChange={onChange}
          onRemove={onRemove}
          onRetry={onRetry}
          errorMessage={fieldState.error?.message ?? error}
        />
      )}
    />
  )
}
