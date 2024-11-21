import { formatText } from '@island.is/application/core'
import { FieldBaseProps, FileUploadField } from '@island.is/application/types'
import { Box, UploadFile } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { FileUploadController } from '@island.is/application/ui-components'
import { useFormContext } from 'react-hook-form'

interface Props extends FieldBaseProps {
  field: FileUploadField
}

export const FileUploadFormField = ({ application, field, error }: Props) => {
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
  const { setValue, watch } = useFormContext()
  const currentValue = watch(id)

  const onRemove = (fileToRemove: UploadFile) => {
    setValue(id, currentValue?.filter((x: UploadFile) => x.key !== fileToRemove.key))
  }
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
          onRemove={onRemove}
        />
      </Box>
    </div>
  )
}
