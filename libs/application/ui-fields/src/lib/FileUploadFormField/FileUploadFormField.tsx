import { formatText, formatTextWithLocale } from '@island.is/application/core'
import { FieldBaseProps, FileUploadField } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import { Box, Text, UploadFileDeprecated } from '@island.is/island-ui/core'
import { FieldDescription } from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { FileUploadController } from '@island.is/application/ui-components'
import { useFormContext } from 'react-hook-form'
import set from 'lodash/set'

interface Props extends FieldBaseProps {
  field: FileUploadField
}

export const FileUploadFormField = ({
  application,
  answerQuestions,
  field,
  error,
}: Props) => {
  const {
    id,
    title,
    titleVariant = 'h4',
    description,
    introduction,
    uploadDescription,
    uploadHeader,
    uploadButtonLabel,
    uploadMultiple,
    uploadAccept,
    maxSize,
    maxSizeErrorText,
    totalMaxSize,
    maxFileCount,
    forImageUpload,
    marginTop,
    marginBottom,
  } = field
  const { formatMessage, lang: locale } = useLocale()
  const { watch } = useFormContext()
  const currentValue = watch(id)

  const onFileRemoveWhenInAnswers = (fileToRemove: UploadFileDeprecated) => {
    const answers = structuredClone(application.answers)
    const updatedAnswers = set(
      answers,
      id,
      currentValue.filter(
        (x: UploadFileDeprecated) => x.key !== fileToRemove.key,
      ),
    )
    answerQuestions?.({
      ...application.answers,
      ...updatedAnswers,
    })
  }

  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      {title && (
        <Text variant={titleVariant} as={titleVariant} marginBottom={2}>
          {formatTextWithLocale(
            title,
            application,
            locale as Locale,
            formatMessage,
          )}
        </Text>
      )}
      {(() => {
        const descSource = description ?? introduction
        if (!descSource) return null
        const formatted = formatTextWithLocale(
          descSource,
          application,
          locale as Locale,
          formatMessage,
        )
        return (
          <FieldDescription
            description={
              Array.isArray(formatted)
                ? formatted.join(' ')
                : String(formatted ?? '')
            }
          />
        )
      })()}

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
          multiple={uploadMultiple ?? false}
          accept={uploadAccept}
          maxSize={maxSize}
          maxSizeErrorText={
            maxSizeErrorText &&
            formatText(maxSizeErrorText, application, formatMessage)
          }
          totalMaxSize={totalMaxSize}
          maxFileCount={maxFileCount}
          forImageUpload={forImageUpload}
          onRemove={onFileRemoveWhenInAnswers}
        />
      </Box>
    </Box>
  )
}
