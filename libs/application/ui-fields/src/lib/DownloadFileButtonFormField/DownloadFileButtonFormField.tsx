import { formatText } from '@island.is/application/core'
import {
  FieldBaseProps,
  DownloadFileButtonField,
} from '@island.is/application/types'
import {
  Box,
  Button,
} from '@island.is/island-ui/core'
import { FC } from 'react'

interface Props extends FieldBaseProps {
  field: DownloadFileButtonField
}

export const DownloadFileButtonFormField: FC<
  React.PropsWithChildren<Props>
> = ({ application, field }) => {
  const fileData = field?.getFileContent?.()
  if (!fileData) {
    throw Error('No valid file data recieved!')
  }
  return (
      <Box display="flex" justifyContent="spaceBetween" alignItems="center">
        <Button
          variant="utility"
          icon="document"
          onClick={() =>
            downloadFile(
              fileData?.filename,
              fileData?.base64Content,
              fileData?.fileType,
            )
          }
        >
          {field.buttonTitle ?? fileData.filename}
        </Button>
      </Box>
  )
}

const downloadFile = (
  name: string,
  base64Content: string,
  mimeType: string,
) => {
    const blob = base64ToBlob(base64Content, mimeType)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

const base64ToBlob = (base64: string, mimeType: string) => {
    const buffer = Buffer.from(base64, 'base64')
    return new Blob([buffer], { type: mimeType })
  }
