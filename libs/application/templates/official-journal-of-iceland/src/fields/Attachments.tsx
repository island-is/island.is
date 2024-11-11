import { OJOIFieldBaseProps } from '../lib/types'
import { Box, Button, InputFileUpload, Stack } from '@island.is/island-ui/core'
import { useFileUpload } from '../hooks/useFileUpload'
import { ALLOWED_FILE_TYPES, ApplicationAttachmentType } from '../lib/constants'
import { useLocale } from '@island.is/localization'
import { attachments } from '../lib/messages/attachments'
import { useState } from 'react'
import { Additions } from '../components/additions/Additions'

export const Attachments = ({ application }: OJOIFieldBaseProps) => {
  const { formatMessage: f } = useLocale()
  const { files, onChange, onRemove } = useFileUpload({
    applicationId: application.id,
    attachmentType: ApplicationAttachmentType.ADDITIONS,
  })

  const [asAddition, setAsAddition] = useState(true)

  return (
    <Stack space={4}>
      <Box>
        <Button
          icon={asAddition ? 'upload' : 'document'}
          iconType="outline"
          variant="ghost"
          size="small"
          onClick={() => setAsAddition((toggle) => !toggle)}
        >
          {asAddition ? `Hlaða upp skjölum` : `Bæta við viðaukum`}
        </Button>
      </Box>
      <Box hidden={!asAddition}>
        <Additions application={application} />
      </Box>
      <Box hidden={asAddition}>
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
    </Stack>
  )
}
