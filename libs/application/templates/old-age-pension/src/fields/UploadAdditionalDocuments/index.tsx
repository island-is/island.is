import { FC, useEffect } from 'react'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  oldAgePensionFormMessage,
  validatorErrorMessages,
} from '../../lib/messages'
import { FILE_SIZE_LIMIT } from '../../lib/constants'
import { FieldBaseProps } from '@island.is/application/types'
import { FileUploadController } from '@island.is/application/ui-components'
import { formatText, getErrorViaPath } from '@island.is/application/core'
import { useFormContext, FieldErrors, FieldValues } from 'react-hook-form'

const UploadAdditionalDocuments: FC<FieldBaseProps> = ({
  field,
  application,
  errors,
  setBeforeSubmitCallback,
}) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const { getValues } = useFormContext()

  const additionalDocumentsRequiredError = getErrorViaPath(
    errors as FieldErrors<FieldValues>,
    'additionalDocumentsRequiredScreen',
  )

  useEffect(() => {
    setBeforeSubmitCallback?.(async () => {
      const documents = getValues(id)

      if (!documents || documents.length === 0) {
        return [false, formatMessage(validatorErrorMessages.requireAttachment)]
      }

      return [true, null]
    })
  }, [setBeforeSubmitCallback, formatMessage, getValues, id])

  return (
    <Box>
      <FileUploadController
        id={id}
        application={application}
        error={additionalDocumentsRequiredError}
        header={formatText(
          oldAgePensionFormMessage.fileUpload.attachmentHeader,
          application,
          formatMessage,
        )}
        description={formatText(
          oldAgePensionFormMessage.fileUpload.attachmentDescription,
          application,
          formatMessage,
        )}
        buttonLabel={formatText(
          oldAgePensionFormMessage.fileUpload.attachmentButton,
          application,
          formatMessage,
        )}
        multiple={true}
        accept=".pdf"
        maxSize={FILE_SIZE_LIMIT}
        maxSizeErrorText={formatText(
          oldAgePensionFormMessage.fileUpload.attachmentMaxSizeError,
          application,
          formatMessage,
        )}
      />
    </Box>
  )
}

export default UploadAdditionalDocuments
