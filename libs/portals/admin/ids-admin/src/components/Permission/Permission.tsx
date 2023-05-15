import { Box, Text } from '@island.is/island-ui/core'

function Permission() {
  return (
    <Box>
      <Box display="flex" columnGap={5}>
        <Box display="flex" flexDirection="column" rowGap={2}>
          <Text as="h1" variant="h2">
            Management
          </Text>
          <Text>
            Lorem ipsum dolor sit amet consectetur. A non ut nulla vitae mauris
            accumsan at tellus facilisi.
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

export default Permission
