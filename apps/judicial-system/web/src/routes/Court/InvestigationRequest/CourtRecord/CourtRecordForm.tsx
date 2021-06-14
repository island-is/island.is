import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { FormContentContainer } from '@island.is/judicial-system-web/src/shared-components'
import { Case } from '@island.is/judicial-system/types'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isLoading: boolean
}

const CourtRecordForm: React.FC<Props> = (props) => {
  return (
    <FormContentContainer>
      <Box marginBottom={7}>
        <Text as="h1" variant="h1">
          Þingbók
        </Text>
      </Box>
    </FormContentContainer>
  )
}

export default CourtRecordForm
