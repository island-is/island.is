import React, { FC } from 'react'

import {
  FieldBaseProps,
  FileUploadField,
  formatText,
} from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import {
  FieldDescription,
  FileUploadController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'

interface Props extends FieldBaseProps {
  field: FileUploadField
}

export const FileUploadFormField: FC<Props> = ({
  application,
  field,
  error,
}) => {
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
    <div>
      {introduction && (
        <FieldDescription
          description={formatText(introduction, application, formatMessage)}
        />
      )}

      <Box paddingTop={2}>
        <FileUploadController
          id={id}
          application={application}
          error={error}
          header={formatText(uploadHeader, application, formatMessage)}
          description={formatText(
            uploadDescription,
            application,
            formatMessage,
          )}
          buttonLabel={formatText(
            uploadButtonLabel,
            application,
            formatMessage,
          )}
          multiple={uploadMultiple}
          accept={uploadAccept}
          maxSize={maxSize}
        />
      </Box>
    </div>
  )
}
