import { useMutation } from '@apollo/client'
import { Dispatch, useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { v4 as uuid } from 'uuid'

import { FormSystemField } from '@island.is/api/schema'
import { CREATE_UPLOAD_URL, STORE_FILE } from '@island.is/form-system/graphql'
import {
  FileUploadStatus,
  InputFileUpload,
  UploadFile,
} from '@island.is/island-ui/core'
import { Action } from '../../../lib'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  hasError?: boolean
  dispatch?: Dispatch<Action>
  lang?: 'is' | 'en'
  applicationId?: string
}

export const FileUpload = ({ item, hasError }: Props) => {
  const { formatMessage } = useIntl()
  const [files, setFiles] = useState<UploadFile[]>([])
  const [error, setError] = useState<string | undefined>(
    hasError ? 'error' : undefined,
  )
  const [createUploadUrl] = useMutation(CREATE_UPLOAD_URL)
  const [uploadFile] = useMutation(STORE_FILE)

  const types = item?.fieldSettings?.fileTypes?.split(',') ?? []

  const updateFile = useCallback((id: string, updated: Partial<UploadFile>) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updated } : f)),
    )
  }, [])

  const uploadToS3 = useCallback(
    async (file: File, id: string) => {
      try {
        const { data } = await createUploadUrl({
          variables: { filename: file.name },
        })
        const presigned = data?.createUploadUrl
        console.log(presigned)
        if (!presigned?.url || !presigned?.fields) {
          throw new Error('Invalid presigned upload response')
        }

        const res = await uploadFile({
          variables: {
            input: {
              storeFileDto: {
                fieldId: item.id,
                sourceKey: presigned.fields.key,
              },
            },
          },
        })

        console.log(res)

        updateFile(id, {
          status: FileUploadStatus.done,
          percent: 100,
          key: presigned.fields.key,
        })
      } catch (err) {
        updateFile(id, {
          status: FileUploadStatus.error,
          error: formatMessage(m.uploadFailed),
        })
      }
    },
    [createUploadUrl, updateFile, formatMessage],
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

      const uploadFiles = selectedFiles.map((file) => ({
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
        uploadToS3(f.originalFileObj as File, f.id)
      })
    },
    [files, item, formatMessage, uploadToS3],
  )

  const onRetry = useCallback(
    (file: UploadFile) => {
      if (file.originalFileObj && file.id) {
        updateFile(file.id, {
          status: FileUploadStatus.uploading,
          percent: 0,
        })
        uploadToS3(file.originalFileObj as File, file.id)
      }
    },
    [uploadToS3, updateFile],
  )

  const onRemove = useCallback((file: UploadFile) => {
    console.log('removing', file)
    setFiles((prev) => prev.filter((f) => f.id !== file.id))
  }, [])

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
