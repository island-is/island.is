import React, { useEffect, useContext } from 'react'
import { InputFileUpload, UploadFile } from '@island.is/island-ui/core'

import { useIntl } from 'react-intl'
import { filesText } from '../../lib/messages'
import { FileUploadContainer } from '..'
import { useFileUpload } from '../../lib/useFileUpload'
import { UploadFileType } from '../../lib/types'

interface Props {
  uploadFiles: UploadFile[]
  fileKey: UploadFileType
  hasError?: boolean
}

const Files = ({ uploadFiles, fileKey, hasError = false }: Props) => {
  const { formatMessage } = useIntl()

  const {
    files,
    uploadErrorMessage,
    onChange,
    onRemove,
    onRetry,
  } = useFileUpload(uploadFiles)

  const stringifyFile = (file: UploadFile) => {
    return {
      key: file.key,
      name: file.name,
      size: file.size,
      status: file.status,
      percent: file?.percent,
    }
  }

  useEffect(() => {
    const formFiles = files
      .filter((f) => f.status === 'done')
      .map((f) => {
        return stringifyFile(f)
      })

    // updateForm({ ...form, [fileKey]: formFiles })
  }, [files])

  return (
    <FileUploadContainer hasError={false}>
      <InputFileUpload
        fileList={files}
        header={formatMessage(filesText.header)}
        description={formatMessage(filesText.description)}
        buttonLabel={formatMessage(filesText.buttonLabel)}
        showFileSize={true}
        errorMessage={uploadErrorMessage}
        onChange={onChange}
        onRemove={onRemove}
        onRetry={onRetry}
      />
    </FileUploadContainer>
  )
}

export default Files
