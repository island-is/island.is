import { useMutation } from '@apollo/client'
import { Dispatch, useCallback, useState } from 'react'
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
import { Action, getValue, uploadToS3 } from '../../../lib'
import { m } from '../../../lib/messages'
import { Controller, useFormContext } from 'react-hook-form'

interface Props {
  item: FormSystemField
  hasError?: boolean
  dispatch?: Dispatch<Action>
}

const initializeFiles = (item: FormSystemField): UploadFile[] => {
  const s3Keys = getValue(item, 's3Key') as string[] | undefined
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

export const FileUpload = ({ item, hasError, dispatch }: Props) => {
  const { formatMessage, lang } = useLocale()
  const { control, setValue, trigger } = useFormContext()
  const [files, setFiles] = useState<UploadFile[]>(initializeFiles(item))
  const [error, setError] = useState<string | undefined>(
    hasError ? 'error' : undefined,
  )
  const [createUploadUrl] = useMutation(CREATE_UPLOAD_URL)
  const [uploadFile] = useMutation(STORE_FILE)
  const [deleteFile] = useMutation(DELETE_FILE)

  const types =
    item?.fieldSettings?.fileTypes
      ?.split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0 && t !== '*') ?? []

  const updateFile = useCallback((id: string, updated: Partial<UploadFile>) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updated } : f)),
    )
  }, [])

  const handleUpload = useCallback(
    async (file: UploadFile, id: string) => {
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
                valueId: item.values?.[0]?.id || '',
              },
            },
          },
        })

        const newKey = `${item.id}/${presigned.fields.key}`

        setFiles((prev) => {
          const next = prev.map((f) =>
            f.id === id
              ? {
                  ...f,
                  status: FileUploadStatus.done,
                  percent: 100,
                  key: newKey,
                }
              : f,
          )

          const nextKeys = next
            .map((f) => f.key)
            .filter((k): k is string => typeof k === 'string' && k.length > 0)

          dispatch?.({
            type: 'SET_FILES',
            payload: { id: item.id, value: nextKeys },
          })

          setValue(item.id, nextKeys, {
            shouldDirty: true,
            shouldValidate: true,
          })
          trigger(item.id)

          return next
        })
      } catch (err) {
        updateFile(id, {
          status: FileUploadStatus.error,
          error: formatMessage(m.uploadFailed),
        })
      }
    },
    [
      createUploadUrl,
      uploadFile,
      item,
      dispatch,
      updateFile,
      formatMessage,
      setValue,
      trigger,
    ],
  )

  const onChange = useCallback(
    (selectedFiles: File[]) => {
      const maxSize = item?.fieldSettings?.fileMaxSize

      if (
        files.length + selectedFiles.length >
        (item?.fieldSettings?.maxFiles ?? 1)
      ) {
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
          const maxSizeInMb = Math.round((maxSize / 1_000_000) * 10) / 10
          setError(formatMessage(m.maxSizeInMb, { maxSizeInMb }))
          return
        }
      }

      setError(undefined)

      const uploadFiles: UploadFile[] = selectedFiles.map((file) => ({
        id: `${file.name}-${uuid()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        status: FileUploadStatus.uploading,
        percent: 0,
        originalFileObj: file,
      }))

      setFiles((prev) => [...prev, ...uploadFiles])

      uploadFiles.forEach((f) => {
        handleUpload(f, f.id as string)
      })
    },
    [files, item, formatMessage, handleUpload],
  )

  const onRetry = useCallback(
    (file: UploadFile) => {
      if (file.originalFileObj && file.id) {
        updateFile(file.id, {
          status: FileUploadStatus.uploading,
          percent: 0,
        })
        handleUpload(file, file.id)
      }
    },
    [handleUpload, updateFile],
  )

  const onRemove = useCallback(
    (file: UploadFile) => {
      deleteFile({
        variables: {
          input: {
            deleteFileDto: {
              key: file.key,
              valueId: item.values?.[0]?.id,
            },
          },
        },
      })
      const newFiles = files.filter(
        (f) => (f.key ?? f.id) !== (file.key ?? file.id),
      )
      setFiles(newFiles)
      setError(undefined)

      const newKeys = newFiles.map((f) => f.key).filter(Boolean) as string[]
      dispatch?.({
        type: 'SET_FILES',
        payload: { id: item.id, value: newKeys },
      })
      setValue(item.id, newKeys, { shouldDirty: true, shouldValidate: true })
      trigger(item.id)
    },
    [deleteFile, dispatch, files, item.id, item.values, setValue, trigger],
  )

  const title = item.isRequired
    ? `${item?.name?.[lang] ?? formatMessage(m.uploadBoxTitle)} *`
    : item?.name?.[lang] ?? formatMessage(m.uploadBoxTitle)

  return (
    <Controller
      key={item.id}
      name={item.id}
      control={control}
      defaultValue={getValue(item, 's3Key') ?? []}
      rules={{
        validate: (v) =>
          !(item.isRequired ?? false) ||
          (Array.isArray(v) && v.length > 0) ||
          formatMessage(m.required),
      }}
      render={({ fieldState }) => (
        <InputFileUpload
          name={`fileUpload-${item.id}`}
          files={files}
          accept={types}
          title={title}
          description={formatMessage(m.uploadBoxDescription, {
            fileEndings: types.join(', '),
          })}
          buttonLabel={formatMessage(m.uploadBoxButtonLabel)}
          disabled={
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
