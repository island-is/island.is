import { Box, Text } from '@island.is/island-ui/core'

export const generateLine = (heading: string, content?: React.ReactNode) => {
  if (!content) {
    return null
  }
  return (
    <Box>
      <Text variant="medium" fontWeight="semiBold">
        {heading}
      </Text>
      {content}
    </Box>
  )
}
