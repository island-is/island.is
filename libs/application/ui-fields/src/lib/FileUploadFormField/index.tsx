import React, { FC } from 'react'
import {
  FieldBaseProps,
  FileUploadField,
  formatText,
} from '@island.is/application/core'
import { Box, Text } from '@island.is/island-ui/core'
import { FileUploadController } from '@island.is/shared/form-fields'

import { useLocale } from '@island.is/localization'

interface Props extends FieldBaseProps {
  field: FileUploadField
}
const FileUploadFormField: FC<Props> = ({ application, field, error }) => {
  const {
    id,
    introduction,
    uploadDescription = 'Documents accepted with extension: .pdf, .docx, .rtf',
    uploadHeader = 'Drag documents here to upload',
    uploadButtonLabel = 'Select documents to upload',
    uploadMultiple,
    uploadAccept,
    maxSize,
  } = field

  const { formatMessage } = useLocale()

  return (
    <Box>
      <Text>{formatText(introduction, application, formatMessage)}</Text>

      <FileUploadController
        id={id}
        application={application}
        error={error}
        header={uploadHeader}
        description={uploadDescription}
        buttonLabel={uploadButtonLabel}
        multiple={uploadMultiple}
        accept={uploadAccept}
        maxSize={maxSize}
      />
    </Box>
  )
}

export default FileUploadFormField
