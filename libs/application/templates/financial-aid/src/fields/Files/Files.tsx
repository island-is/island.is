import React, { useEffect } from 'react'
import {
  InputFileUploadDeprecated,
  UploadFileDeprecated,
} from '@island.is/island-ui/core'

import { useIntl } from 'react-intl'
import { filesText } from '../../lib/messages'
import { FileUploadContainer } from '..'
import { UploadFileType } from '../../lib/types'
import { useFormContext } from 'react-hook-form'
import { useFileUpload } from '../../lib/hooks/useFileUpload'
import { FILE_SIZE_LIMIT, UPLOAD_ACCEPT } from '../../lib/constants'

interface Props {
  uploadFiles: UploadFileDeprecated[]
  fileKey: UploadFileType
  folderId: string
  hasError?: boolean
}

const Files = ({ uploadFiles, fileKey, folderId, hasError = false }: Props) => {
  const { formatMessage } = useIntl()
  const { setValue } = useFormContext()

  const {
    files,
    uploadErrorMessage,
    onChange,
    onRemove,
    onRetry,
    onUploadRejection,
  } = useFileUpload(uploadFiles, folderId)

  const fileToObject = (file: UploadFileDeprecated) => {
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
        return fileToObject(f)
      })
    setValue(fileKey, formFiles)
  }, [files])

  return (
    <FileUploadContainer hasError={hasError}>
      <InputFileUploadDeprecated
        fileList={files}
        header={formatMessage(filesText.header)}
        description={formatMessage(filesText.description)}
        buttonLabel={formatMessage(filesText.buttonLabel)}
        showFileSize={true}
        errorMessage={uploadErrorMessage}
        onChange={onChange}
        onRemove={onRemove}
        onRetry={onRetry}
        onUploadRejection={onUploadRejection}
        maxSize={FILE_SIZE_LIMIT}
        accept={UPLOAD_ACCEPT}
      />
    </FileUploadContainer>
  )
}

export default Files
