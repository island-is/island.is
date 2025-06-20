import {
  InputFileUploadDeprecated,
  UploadFileDeprecated,
  fileToObjectDeprecated,
  FileUploadStatus,
  UploadFile,
  InputFileUpload,
} from '@island.is/island-ui/core'
import { Dispatch, useCallback, useState } from 'react'
import { uuid } from 'uuidv4'
import { FormSystemField } from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { fileTypes } from '../../../lib/fileTypes'
import { m, webMessages } from '../../../lib/messages'
import { Action } from '../../../lib'

interface Props {
  item: FormSystemField
  hasError?: boolean
  dispatch?: Dispatch<Action>
  lang?: 'is' | 'en'
  applicationId?: string
}

// This component is still very much a WIP
export const FileUpload = ({ item, hasError }: Props) => {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [error, setError] = useState<string | undefined>(
    hasError ? 'error' : undefined,
  )
  const { formatMessage } = useIntl()
  const types = item?.fieldSettings?.fileTypes?.split(',') ?? []

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

      //Upload files to S3 missing here
    },
    [files, item, formatMessage],
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateFile = useCallback((file: UploadFile, newId?: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === file.id ? { ...f, ...file, id: newId ?? file.id } : f,
      ),
    )
  }, [])

  // TODO: add handleRetry
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onRetry = useCallback((file: UploadFile) => {
    // handleRetry(file, updateFile)
    // },[handleRetry, updateFile])
  }, [])

  // Handle file removal
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onRemove = useCallback((file: UploadFile) => {
    // handleRemove(file, removedFile => {
    //   setFiles(prev => prev.filter(f => f.id !== removedFile.id))
    // })
    // }, [handleRemove])
  }, [])

  return (
    <InputFileUpload
      name={`fileUpload-${item.id}`}
      files={files}
      accept={types}
      title={formatMessage(webMessages.uploadBoxTitle)}
      description={formatMessage(webMessages.uploadBoxDescription, {
        fileEndings: types.join(', '),
      })}
      buttonLabel={formatMessage(webMessages.uploadBoxButtonLabel)}
      onChange={onChange}
      onRemove={onRemove}
      onRetry={onRetry}
      errorMessage={error}
    />
  )
}

export const OldFileUpload = ({ item, hasError, lang = 'is' }: Props) => {
  const [error, setError] = useState<string | undefined>(
    hasError ? 'error' : undefined,
  )
  const [fileList, setFileList] = useState<Array<UploadFileDeprecated>>([])
  const { formatMessage } = useIntl()
  const types = item?.fieldSettings?.fileTypes?.split(',') ?? []
  const onChange = (files: File[]) => {
    const uploadFiles = files.map((file) => fileToObjectDeprecated(file))
    const uploadFilesWithKey = uploadFiles.map((f) => ({
      ...f,
      key: uuid(),
    }))

    // Check whether upload will exceed limit and if so, prevent it
    const currentAmount = item?.fieldSettings?.maxFiles ?? 1
    if (fileList.length + uploadFilesWithKey.length > currentAmount) {
      setError(
        `${formatMessage(m.maxFileError)} ${item.fieldSettings?.maxFiles}`,
      )
      return
    }
    setError('')
    const newFileList = [...fileList, ...uploadFilesWithKey]
    setFileList(newFileList)
  }

  const onRemove = (fileToRemove: UploadFileDeprecated) => {
    const newFileList = fileList.filter((file) => file.key !== fileToRemove.key)
    setFileList(newFileList)
  }

  return (
    <InputFileUploadDeprecated
      name="fileUpload"
      fileList={fileList}
      header={item?.name?.[lang] ?? ''}
      description={`${formatMessage(m.previewAllowedFileTypes)}: ${types?.map(
        (f: string) => `${f} `,
      )}`}
      buttonLabel={formatMessage(m.fileUploadButton)}
      onChange={onChange}
      onRemove={onRemove}
      errorMessage={error}
      accept={
        types?.map((t: string) => fileTypes[t as keyof typeof fileTypes]) ?? []
      }
      showFileSize
      maxSize={item?.fieldSettings?.fileMaxSize ?? 1}
      multiple={(item?.fieldSettings?.maxFiles ?? 0) > 1}
    />
  )
}
