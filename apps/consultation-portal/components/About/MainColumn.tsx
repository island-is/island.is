import { Box, Text } from '@island.is/island-ui/core'
import Information from './Information'

const MainColumn = () => {
  return (
    <Box marginBottom={4} paddingTop={2}>
      <Text variant="h1" color="blue400">
        {'Um samraðsgátt'}
      </Text>
      <Information />
    </Box>
  )
}

export default MainColumn
