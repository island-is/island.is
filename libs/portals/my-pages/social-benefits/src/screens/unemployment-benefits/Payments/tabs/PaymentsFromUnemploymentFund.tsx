import { Box, SkeletonLoader } from '@island.is/island-ui/core'

// Temporary placeholder, will be replaced with data from graphql
export const PaymentsFromUnemploymentFund = () => {
  return (
    <Box paddingTop={4}>
      <SkeletonLoader repeat={3} space={2} />
    </Box>
  )
}
