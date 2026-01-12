import { InputFields, OJOIFieldBaseProps } from '../lib/types'
import {
  Box,
  Button,
  InputFileUploadDeprecated,
  Stack,
} from '@island.is/island-ui/core'
import { useFileUpload } from '../hooks/useFileUpload'
import { ALLOWED_FILE_TYPES, ApplicationAttachmentType } from '../lib/constants'
import { useLocale } from '@island.is/localization'
import { attachments } from '../lib/messages/attachments'
import { useState } from 'react'
import { Additions } from '../components/additions/Additions'
import { useApplication } from '../hooks/useUpdateApplication'
import { useFormContext } from 'react-hook-form'

export const Attachments = ({ application }: OJOIFieldBaseProps) => {
  const { setValue } = useFormContext()
  const { formatMessage: f } = useLocale()
  const { files, onChange, onRemove } = useFileUpload({
    applicationId: application.id,
    attachmentType: ApplicationAttachmentType.ADDITIONS,
  })

  const { updateApplication, application: currentApplication } = useApplication(
    {
      applicationId: application.id,
    },
  )

  const [asDocument, setAsDocument] = useState(
    application.answers.misc?.asDocument ?? false,
  )

  const handleChange = () => {
    const current = asDocument
    setAsDocument((toggle) => !toggle)

    setValue(InputFields.misc.asDocument, !current)
    updateApplication({
      ...currentApplication.answers,
      misc: {
        ...currentApplication.answers.misc,
        asDocument: !current,
      },
    })
  }

  return (
    <Stack space={4}>
      <Box>
        <Button
          icon={asDocument ? 'upload' : 'document'}
          iconType="outline"
          variant="ghost"
          size="small"
          onClick={handleChange}
        >
          {f(
            asDocument
              ? attachments.buttons.asDocument
              : attachments.buttons.asAttachment,
          )}
        </Button>
      </Box>
      {asDocument ? (
        <InputFileUploadDeprecated
          header={f(attachments.inputs.fileUpload.header)}
          description={f(attachments.inputs.fileUpload.description)}
          buttonLabel={f(attachments.inputs.fileUpload.buttonLabel)}
          fileList={files}
          accept={ALLOWED_FILE_TYPES}
          onChange={onChange}
          onRemove={onRemove}
          defaultFileBackgroundColor={{
            background: 'blue100',
            border: 'blue200',
            icon: 'blue200',
          }}
        />
      ) : (
        <Additions application={application} />
      )}
    </Stack>
  )
}
