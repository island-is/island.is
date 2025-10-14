import { useMutation } from '@apollo/client'
import { Dispatch, useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { v4 as uuid } from 'uuid'

import { FormSystemField } from '@island.is/api/schema'
import { CREATE_UPLOAD_URL } from '@island.is/form-system/graphql'
import {
  FileUploadStatus,
  InputFileUpload,
  UploadFile,
} from '@island.is/island-ui/core'
import { Action } from '../../../lib'
import { m } from '../../../lib/messages'

const uploadViaPresignedPost = (
  presigned: { url: string; fields: Record<string, string> },
  file: File,
  onProgress?: (progress: number) => void,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const form = new FormData()
    Object.entries(presigned.fields).forEach(([key, value]) =>
      form.append(key, value),
    )
    form.append('file', file)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', presigned.url)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100)
        onProgress?.(progress)
      }
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve()
      else reject(new Error(`Upload failed with status ${xhr.status}`))
    }
    xhr.onerror = () => reject(new Error('Network error during file upload'))
    xhr.send(form)
  })
}

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

        if (!presigned?.url || !presigned?.fields) {
          throw new Error('Invalid presigned upload response')
        }

        await uploadViaPresignedPost(presigned, file, (progress) => {
          updateFile(id, { percent: progress })
        })

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
