import { OJOIFieldBaseProps } from '../lib/types'
import { ALLOWED_FILE_TYPES, ApplicationAttachmentType } from '../lib/constants'
import { attachments } from '../lib/messages/attachments'
import { useLocale } from '@island.is/localization'
import { InputFileUploadDeprecated, Box } from '@island.is/island-ui/core'

import { useFileUpload } from '../hooks/useFileUpload'

export const SupportingDoc = ({ application }: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { files, onChange, onRemove } = useFileUpload({
    applicationId: application.id,
    attachmentType: ApplicationAttachmentType.SUPPORTING,
  })
  return (
    <Box>
      <InputFileUploadDeprecated
        header={f(attachments.inputs.fileUpload.header)}
        description={f(attachments.inputs.fileUpload.description)}
        buttonLabel={f(attachments.inputs.fileUpload.buttonLabel)}
        fileList={files}
        accept={ALLOWED_FILE_TYPES}
        onChange={onChange}
        onRemove={onRemove}
        multiple
        defaultFileBackgroundColor={{
          background: 'blue100',
          border: 'blue200',
          icon: 'blue200',
        }}
      />
    </Box>
  )
}
