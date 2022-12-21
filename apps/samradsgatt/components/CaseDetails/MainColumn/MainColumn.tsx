import { Box, Text } from '@island.is/island-ui/core'
import CaseOverview from './CaseOverview'
import Review from './Review'
import WriteReview from './WriteReview'

const MainColumn = () => {
  return (
    <Box paddingLeft={4}>
      <CaseOverview />
      <Box marginBottom={6}>
        <Text variant="h1" color="blue400" paddingY={2}>
          {'Innsendar umsagnir'}
        </Text>
        <Review />
      </Box>
      <WriteReview />
    </Box>
  )
}

export default MainColumn
