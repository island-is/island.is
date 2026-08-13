import { Box, Text } from '@island.is/island-ui/core'

export const generateLine = (
  key: string,
  heading: string,
  content?: React.ReactNode,
) => {
  if (!content) {
    return null
  }
  return (
    <Box key={key}>
      <Text variant="medium" fontWeight="semiBold">
        {heading}
      </Text>
      {content}
    </Box>
  )
}
