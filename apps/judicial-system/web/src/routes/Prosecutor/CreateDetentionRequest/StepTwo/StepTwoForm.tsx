import React from 'react'
import { Case } from '@island.is/judicial-system/types'
import { Box, Text } from '@island.is/island-ui/core'

interface Props {
  theCase: Case
}

const StepTwoForm: React.FC<Props> = (props) => {
  const { theCase } = props
  return (
    <Box marginBottom={7}>
      <Text as="h1" variant="h1">
        Óskir um fyrirtöku
      </Text>
    </Box>
  )
}

export default StepTwoForm
