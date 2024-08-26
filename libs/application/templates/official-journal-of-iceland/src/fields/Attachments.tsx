import { OJOIFieldBaseProps } from '../lib/types'
import {
  Box,
  InputFileUpload,
  UploadFile,
  fileToObject,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { useFileUpload } from '../hooks/useFileUpload'

export const Attachments = ({ application }: OJOIFieldBaseProps) => {
  const { uploadFiles, files } = useFileUpload({
    applicationId: application.id,
  })

  return (
    <Box padding={[2, 2, 3]} background="blue100">
      <InputFileUpload
        fileList={files}
        header="Drag documents here to upload"
        description="Documents accepted with extension: .pdf, .docx, .rtf"
        buttonLabel="Select documents to upload"
        onChange={(files) =>
          uploadFiles(files.map((file) => fileToObject(file)))
        }
        onRemove={(file) => {
          console.log(file)
        }}
      />
    </Box>
  )
}
