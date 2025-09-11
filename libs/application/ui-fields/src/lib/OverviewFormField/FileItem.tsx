import { ActionCard, Box } from '@island.is/island-ui/core'

type Props = {
  fileName: string
  fileSize?: string
  fileType?: string
}

export const FileItem = ({ fileName, fileSize, fileType }: Props) => {
  return (
    <Box>
      <ActionCard
        heading={fileName}
        text={fileSize ?? ''}
        headingVariant="h4"
        cta={{
          label: '',
        }}
        tag={{
          label: fileType ?? '',
        }}
        backgroundColor="blue"
      />
    </Box>
  )
}
