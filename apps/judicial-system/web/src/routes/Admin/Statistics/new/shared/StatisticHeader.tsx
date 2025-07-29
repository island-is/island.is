import { Box, Text } from '@island.is/island-ui/core'

export const StatisticHeader = ({ title }: { title: string }) => {
  return (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      alignItems="center"
      marginBottom={[2, 2, 4, 6, 6]}
    >
      <Text as="h1" variant="h1">
        {title}
      </Text>
    </Box>
  )
}
