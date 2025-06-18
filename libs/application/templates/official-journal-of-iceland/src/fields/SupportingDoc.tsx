import { OJOIFieldBaseProps } from '../lib/types'
import { ALLOWED_FILE_TYPES, ApplicationAttachmentType } from '../lib/constants'
import { original } from '../lib/messages'
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
        header={f(original.fileUpload.header)}
        description={f(original.fileUpload.description)}
        buttonLabel={f(original.fileUpload.buttonLabel)}
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
