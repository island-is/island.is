import { useMutation } from '@apollo/client'
import { Dispatch, useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { v4 as uuid } from 'uuid'

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
  return s3Keys.map((key) => ({
    name: key.split('_').pop() as string,
    status: FileUploadStatus.done,
    key,
  }))
}

export const FileUpload = ({ item, hasError, dispatch }: Props) => {
  const { formatMessage } = useIntl()
  const [files, setFiles] = useState<UploadFile[]>(initializeFiles(item))
  const [error, setError] = useState<string | undefined>(
    hasError ? 'error' : undefined,
  )
  const [createUploadUrl] = useMutation(CREATE_UPLOAD_URL)
  const [uploadFile] = useMutation(STORE_FILE)
  const [deleteFile] = useMutation(DELETE_FILE)

  const types = item?.fieldSettings?.fileTypes?.split(',') ?? []

  const updateFile = useCallback((id: string, updated: Partial<UploadFile>) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updated } : f)),
    )
  }, [])

  const handleUpload = useCallback(
    async (file: UploadFile, id: string) => {
      try {
        const sanitizedFilename = file.name.replace(/_/g, '-')

        const { data } = await createUploadUrl({
          variables: { filename: sanitizedFilename },
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

        const currentKeys = getValue(item, 's3Key') ?? []
        const newKeys = [...currentKeys, `${item.id}/${presigned.fields.key}`]
        dispatch &&
          dispatch({
            type: 'SET_FILES',
            payload: { id: item.id, value: newKeys },
          })

        updateFile(id, {
          status: FileUploadStatus.done,
          percent: 100,
          key: `${item.id}/${presigned.fields.key}`,
        })
      } catch (err) {
        updateFile(id, {
          status: FileUploadStatus.error,
          error: formatMessage(m.uploadFailed),
        })
      }
    },
    [createUploadUrl, uploadFile, item, dispatch, updateFile, formatMessage],
  )

  const onChange = useCallback(
    (selectedFiles: File[]) => {
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
      const newFiles = files.filter((f) => f.id !== file.id)
      setFiles(newFiles)
      dispatch &&
        dispatch({
          type: 'SET_FILES',
          payload: { id: item.id, value: newFiles },
        })
    },
    [deleteFile, dispatch, files, item.id, item.values],
  )

  return (
    <InputFileUpload
      name={`fileUpload-${item.id}`}
      files={files}
      accept={types}
      title={formatMessage(m.uploadBoxTitle)}
      description={formatMessage(m.uploadBoxDescription, {
        fileEndings: types.join(', '),
      })}
      buttonLabel={formatMessage(m.uploadBoxButtonLabel)}
      onChange={onChange}
      onRemove={onRemove}
      onRetry={onRetry}
      errorMessage={error}
    />
  )
}
