import { OJOIFieldBaseProps } from '../lib/types'
import { Box, InputFileUpload } from '@island.is/island-ui/core'
import { useFileUpload } from '../hooks/useFileUpload'
import { ALLOWED_FILE_TYPES, ApplicationAttachmentType } from '../lib/constants'
import { useLocale } from '@island.is/localization'
import { attachments } from '../lib/messages/attachments'

export const Attachments = ({ application }: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { files, onChange, onRemove } = useFileUpload({
    applicationId: application.id,
    attachmentType: ApplicationAttachmentType.ADDITIONS,
  })

  return (
    <Box>
      <InputFileUpload
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
    </Box>
  )
}
