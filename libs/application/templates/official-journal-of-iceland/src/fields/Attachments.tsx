import { OJOIFieldBaseProps } from '../lib/types'
import {
  Box,
  InputFileUpload,
  UploadFile,
  fileToObject,
} from '@island.is/island-ui/core'
import { useState } from 'react'

export const Attachments = ({ application }: OJOIFieldBaseProps) => {
  const [files, setFiles] = useState<UploadFile[]>([])

  const onUploadChange = (newFiles: File[]) => {
    if (!newFiles) {
      setFiles([])
      return
    }

    console.log(newFiles)

    const uploadFiles: UploadFile[] = newFiles.map((file) => fileToObject(file))

    setFiles([...files, ...uploadFiles])
  }

  return (
    <Box padding={[2, 2, 3]} background="blue100">
      <InputFileUpload
        fileList={files}
        header="Drag documents here to upload"
        description="Documents accepted with extension: .pdf, .docx, .rtf"
        buttonLabel="Select documents to upload"
        onChange={onUploadChange}
        onRemove={(file) => {
          setFiles(files.filter((f) => f !== file))
        }}
      />
    </Box>
  )
}
