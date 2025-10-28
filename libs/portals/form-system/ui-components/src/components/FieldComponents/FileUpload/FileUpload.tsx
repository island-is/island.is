import { useMutation } from '@apollo/client'
import { FormSystemField } from '@island.is/api/schema'
import { CREATE_UPLOAD_URL } from '@island.is/form-system/graphql'
import {
  FileUploadStatus,
  InputFileUpload,
  UploadFile,
} from '@island.is/island-ui/core'
import { Dispatch, useCallback, useState } from 'react'
import { useIntl } from 'react-intl'
import { uuid } from 'uuidv4'
import { Action } from '../../../lib'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  hasError?: boolean
  dispatch?: Dispatch<Action>
  applicationId?: string
}

// export interface UploadFile {
//   name: string
//   id?: string
//   type?: string
//   key?: string
//   status?: FileUploadStatus
//   percent?: number
//   originalFileObj?: File | Blob
//   error?: string
//   size?: number
// }

export const FileUpload = ({ item, hasError }: Props) => {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [error, setError] = useState<string | undefined>(
    hasError ? 'error' : undefined,
  )
  const [createUploadUrl] = useMutation(CREATE_UPLOAD_URL)
  const { formatMessage } = useIntl()
  const types = item?.fieldSettings?.fileTypes?.split(',') ?? []

  const updateFile = useCallback((id: string, patch: Partial<UploadFile>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }, [])

  const setProgress = useCallback(
    (id: string | undefined, pct: number) => {
      if (!id) return
      updateFile(id, {
        percent: Math.max(0, Math.min(100, pct)),
        status: FileUploadStatus.uploading,
      })
    },
    [updateFile],
  )

  const markDone = useCallback(
    (id: string | undefined, s3Key: string) => {
      if (!id) return
      updateFile(id, {
        status: FileUploadStatus.done,
        percent: 100,
        key: s3Key,
      })
    },
    [updateFile],
  )

  const markError = useCallback(
    (id: string | undefined, msg: string) => {
      if (!id) return
      updateFile(id, {
        status: FileUploadStatus.error,
        error: msg,
        percent: 0,
      })
    },
    [updateFile],
  )

  const onChange = useCallback(
    async (selectedFiles: File[]) => {
      const max = item?.fieldSettings?.maxFiles ?? 1
      if (files.length + selectedFiles.length > max) {
        setError(
          `${formatMessage(m.maxFileError)} ${
            item.fieldSettings?.maxFiles ?? 1
          }`,
        )
        return
      }

      setError(undefined)

      const staged: UploadFile[] = selectedFiles.map((file) => ({
        id: `${file.name}-${uuid()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        status: FileUploadStatus.uploading,
        percent: 0,
        originalFileObj: file,
      }))

      setFiles((prev) => [...prev, ...staged])

      for (const row of staged) {
        const fileObj = row.originalFileObj
        if (!(fileObj instanceof File)) {
          markError(row.id, 'Missing file object')
          continue
        }

        try {
          const { data } = await createUploadUrl({
            variables: {
              filename: row.name,
            },
          })

          const res = data?.createUploadUrl
          if (!res?.url || !res?.fields) {
            throw new Error('Could not get upload URL')
          }

          await uploadViaPresignedPost(
            { url: res.url, fields: res.fields },
            fileObj,
            (pct) => setProgress(row.id, pct),
          )

          const key = res.key ?? res.fields?.key
          if (!key) console.warn('No S3 key returned!')
          markDone(row.id, key ?? row.id)
        } catch (e) {
          const msg = e?.message ?? 'Upload failed'
          markError(row.id, msg)
          setError(msg)
        }
      }
    },
    [
      item.fieldSettings?.maxFiles,
      files.length,
      formatMessage,
      createUploadUrl,
      setProgress,
      markDone,
      markError,
    ],
  )

  const onRetry = useCallback(
    async (row: UploadFile) => {
      if (!row?.id) return
      const fileObj = row.originalFileObj
      if (!(fileObj instanceof File)) {
        markError(row.id, 'Missing file')
        return
      }

      updateFile(row.id, {
        status: FileUploadStatus.uploading,
        percent: 0,
        error: undefined,
      })

      try {
        const { data } = await createUploadUrl({
          variables: {
            filename: row.name,
          },
        })

        const res = data?.createUploadUrl
        if (!res?.url || !res?.fields) {
          throw new Error('No presigned POST returned')
        }

        await uploadViaPresignedPost(
          { url: res.url, fields: res.fields },
          fileObj,
          (pct) => setProgress(row.id, pct),
        )

        const key = res.key ?? res.fields?.key
        if (!key) console.warn('No S3 key returned!')
        markDone(row.id, key ?? row.id)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        const msg = e?.message ?? 'Upload failed'
        markError(row.id, msg)
        setError(msg)
      }
    },
    [createUploadUrl, updateFile, setProgress, markDone, markError],
  )

  // Remove a single row from UI (optionally also delete from storage/backend)
  const onRemove = useCallback((row: UploadFile) => {
    if (!row?.id) return
    setFiles((prev) => prev.filter((f) => f.id !== row.id))
    // Optional: if already uploaded and you want to delete from S3/backend:
    // if (row.key) await deleteUploadedObject({ variables: { key: row.key } })
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
