import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import CaseOverview from './CaseOverview'
import Review from './Review'
import WriteReview from './WriteReview'
import { Advice, Case } from '../../../types/viewModels'

interface MainColumnProps {
  chosenCase: Case
  advices?: Array<Advice>
}

const MainColumn: React.FC<MainColumnProps> = ({ chosenCase, advices }) => {
  console.log('case', chosenCase)
  return (
    <Box paddingLeft={4}>
      <CaseOverview chosenCase={chosenCase} />
      <Box marginBottom={6}>
        <Text variant="h1" color="blue400" paddingY={2}>
          {'Innsendar umsagnir'}
        </Text>
        {advices.map((advice) => {
          return <Review advice={advice} key={advice.number} />
        })}
      </Box>
      <WriteReview />
    </Box>
  )
}

export default MainColumn
