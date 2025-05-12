import {
  InputFileUploadDeprecated,
  UploadFileDeprecated,
  fileToObjectDeprecated,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { uuid } from 'uuidv4'
import { FormSystemField } from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { fileTypes } from '../../../lib/fileTypes'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemField
  hasError?: boolean
  lang?: 'is' | 'en'
}

export const FileUpload = ({ item, hasError, lang = 'is' }: Props) => {
  const [error, setError] = useState<string | undefined>(hasError ? 'error' : undefined)
  const [fileList, setFileList] = useState<Array<UploadFile>>([])
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
    <>
      <InputFileUpload
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
    </>
  )
}
