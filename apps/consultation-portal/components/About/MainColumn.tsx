import { Box, Text } from '@island.is/island-ui/core'
import Information from './Information'

const MainColumn = () => {
  return (
    <Box>
      <Text variant="h1" color="blue400">
        {'Um samráðsgátt'}
      </Text>
      <Information />
    </Box>
  )
}

export default MainColumn
