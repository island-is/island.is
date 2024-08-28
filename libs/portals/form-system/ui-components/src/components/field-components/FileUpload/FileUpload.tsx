import {
  InputFileUpload,
  UploadFile,
  fileToObject,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { uuid } from 'uuidv4'
import { FormSystemInput } from '@island.is/api/schema'
import { useIntl } from 'react-intl'
import { fileTypes } from '../../../lib/fileTypes'
import { m } from '../../../lib/messages'

interface Props {
  item: FormSystemInput
}

export const FileUpload = ({ item }: Props) => {
  const [error, setError] = useState<string | undefined>(undefined)
  const [fileList, setFileList] = useState<Array<UploadFile>>([])
  const { formatMessage } = useIntl()
  const onChange = (files: File[]) => {
    const uploadFiles = files.map((file) => fileToObject(file))
    const uploadFilesWithKey = uploadFiles.map((f) => ({
      ...f,
      key: uuid(),
    }))

    // Check whether upload will exceed limit and if so, prevent it
    const currentAmount = item?.inputSettings?.amount ?? 0
    if (fileList.length + uploadFilesWithKey.length > currentAmount) {
      setError(
        `${formatMessage(m.maxFileError)} ${item.inputSettings?.amount}`,
      )
      return
    }
    setError('')
    const newFileList = [...fileList, ...uploadFilesWithKey]
    setFileList(newFileList)
  }

  const onRemove = (fileToRemove: UploadFile) => {
    const newFileList = fileList.filter((file) => file.key !== fileToRemove.key)
    setFileList(newFileList)
  }

  return (
    <InputFileUpload
      name="fileUpload"
      fileList={fileList}
      header={item?.name?.is ?? ''}
      description={`${formatMessage(
        m.previewAllowedFileTypes,
      )}: ${item?.inputSettings?.types?.map((f: string) => `${f} `)}`}
      buttonLabel={formatMessage(m.fileUploadButton)}
      onChange={onChange}
      onRemove={onRemove}
      errorMessage={fileList.length > 0 ? error : undefined}
      accept={
        item?.inputSettings?.types?.map(
          (t: string) => fileTypes[t as keyof typeof fileTypes],
        ) ?? []
      }
      showFileSize
      maxSize={item?.inputSettings?.maxSize ?? 1}
      multiple={item?.inputSettings?.isMulti ?? false}
    />
  )
}
