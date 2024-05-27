import {
  InputFileUpload,
  UploadFile,
  fileToObject,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { uuid } from 'uuidv4'
import { FormSystemInput } from '@island.is/api/schema'
import { fileTypes } from '../../../../../utils/fileTypes'
import { useIntl } from 'react-intl'
import { m } from '../../../../../lib/messages'

interface Props {
  currentItem: FormSystemInput
}

export const FileUpload = ({ currentItem }: Props) => {
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
    const currentAmount = currentItem?.inputSettings?.amount ?? 0
    if (fileList.length + uploadFilesWithKey.length > currentAmount) {
      setError(
        `${formatMessage(m.maxFileError)} ${currentItem.inputSettings?.amount}`,
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
    <>
      <InputFileUpload
        name="fileUpload"
        fileList={fileList}
        header={currentItem?.name?.is ?? ''}
        description={`${formatMessage(
          m.previewAllowedFileTypes,
        )}: ${currentItem?.inputSettings?.types?.map((f: string) => `${f} `)}`}
        buttonLabel={formatMessage(m.fileUploadButton)}
        onChange={onChange}
        onRemove={onRemove}
        errorMessage={fileList.length > 0 ? error : undefined}
        accept={
          currentItem?.inputSettings?.types?.map(
            (t: string) => fileTypes[t as keyof typeof fileTypes],
          ) ?? []
        }
        showFileSize
        maxSize={currentItem?.inputSettings?.maxSize ?? 1}
        multiple={currentItem?.inputSettings?.isMulti ?? false}
      />
    </>
  )
}
