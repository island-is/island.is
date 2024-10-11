import { FormSystemInput } from '@island.is/api/schema'
import { Box, Button, Text } from '@island.is/island-ui/core'

interface Props {
  data: FormSystemInput
}

export const MessageWithLink = ({ data }: Props) => {
  const formatUrl = (url: string): string => {
    if (url.startsWith('http://')) {
      url = url.replace('http://', 'https://')
    } else if (!url.startsWith('https://')) {
      url = 'https://' + url
    }
    return url
  }
  return (
    <Box
      flexDirection="row"
      display="flex"
      padding={4}
      background="white"
      alignItems="center"
    >
      <Box display="flex" flexDirection="column">
        <Box paddingBottom={1}>
          <Text variant="h4">{data?.name?.is}</Text>
        </Box>
        <Box overflow="initial">
          <Text>{data?.description?.is}</Text>
        </Box>
      </Box>
      {data.inputSettings?.hasLink && (
        <Box
          alignItems="center"
          marginLeft="auto"
          style={{ top: '50%' }}
          paddingLeft={1}
        >
          <Button
            onClick={() => {
              window.open(formatUrl(data.inputSettings?.url ?? ''), '_blank')
            }}
            size="small"
            icon="open"
            variant="ghost"
          >
            {data?.inputSettings.buttonText?.is}
          </Button>
        </Box>
      )}
    </Box>
  )
}
