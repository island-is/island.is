import { OJOIFieldBaseProps } from '../lib/types'
import { Box, InputFileUpload } from '@island.is/island-ui/core'
import { useFileUpload } from '../hooks/useFileUpload'
import { ALLOWED_FILE_TYPES, ApplicationAttachmentType } from '../lib/constants'

export const Attachments = ({ application }: OJOIFieldBaseProps) => {
  const { files, onChange, onRemove } = useFileUpload({
    applicationId: application.id,
    attachmentType: ApplicationAttachmentType.ADDITIONS,
  })

  return (
    <Box padding={[2, 2, 3]} background="blue100">
      <InputFileUpload
        fileList={files}
        accept={ALLOWED_FILE_TYPES}
        header="Drag documents here to upload"
        description="Documents accepted with extension: .pdf, .docx, .rtf"
        buttonLabel="Select documents to upload"
        onChange={onChange}
        onRemove={onRemove}
      />
    </Box>
  )
}
