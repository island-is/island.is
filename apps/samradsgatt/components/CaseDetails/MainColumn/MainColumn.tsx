import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import CaseOverview from './CaseOverview'
import Review from './Review'
import WriteReview from './WriteReview'
import { Case } from '../../../types/viewModels'

interface MainColumnProps {
  detailedCase: Case
}

const MainColumn: React.FC<MainColumnProps> = ({ detailedCase }) => {
  return (
    <Box paddingLeft={4}>
      <CaseOverview detailedCase={detailedCase} />
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
