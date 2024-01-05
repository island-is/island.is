import React, { FC } from 'react'

import { formatText } from '@island.is/application/core'
import { FieldBaseProps, FileUploadField } from '@island.is/application/types'
import { Box } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { FileUploadController } from '@island.is/application/ui-components'

interface Props extends FieldBaseProps {
  field: FileUploadField
}

export const FileUploadFormField: FC<React.PropsWithChildren<Props>> = ({
  application,
  field,
  error,
}) => {
  const {
    id,
    introduction,
    uploadDescription,
    uploadHeader,
    uploadButtonLabel,
    uploadMultiple,
    uploadAccept,
    maxSize,
    maxSizeErrorText,
    forImageUpload,
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
          header={
            uploadHeader && formatText(uploadHeader, application, formatMessage)
          }
          description={
            uploadDescription &&
            formatText(uploadDescription, application, formatMessage)
          }
          buttonLabel={
            uploadButtonLabel &&
            formatText(uploadButtonLabel, application, formatMessage)
          }
          multiple={uploadMultiple}
          accept={uploadAccept}
          maxSize={maxSize}
          maxSizeErrorText={
            maxSizeErrorText &&
            formatText(maxSizeErrorText, application, formatMessage)
          }
          forImageUpload={forImageUpload}
        />
      </Box>
    </div>
  )
}
