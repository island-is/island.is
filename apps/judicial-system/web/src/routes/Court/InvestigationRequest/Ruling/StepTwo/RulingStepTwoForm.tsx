import React from 'react'
import { Case } from '@island.is/judicial-system/types'
import { FormContentContainer } from '@island.is/judicial-system-web/src/shared-components'
import { Box, Text } from '@island.is/island-ui/core'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isLoading: boolean
}

const RulingStepTwoForm: React.FC<Props> = (props) => {
  return (
    <FormContentContainer>
      <Box marginBottom={7}>
        <Text as="h1" variant="h1">
          Úrskurður og kæra
        </Text>
      </Box>
    </FormContentContainer>
  )
}

export default RulingStepTwoForm
