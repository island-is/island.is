import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { FormContentContainer } from '@island.is/judicial-system-web/src/shared-components'
import { Case } from '@island.is/judicial-system/types'
import LokeCaseNumber from '../../SharedComponents/LokeCaseNumber/LokeCaseNumber'

interface Props {
  workingCase: Case
}

const DefendantForm: React.FC<Props> = (props) => {
  const { workingCase } = props

  return (
    <FormContentContainer>
      <Box marginBottom={7}>
        <Text as="h1" variant="h1">
          Varnaraðili
        </Text>
      </Box>
      <Box component="section" marginBottom={5}>
        <Box marginBottom={3}>
          <Text as="h3" variant="h3">
            Málsnúmer lögreglu
          </Text>
        </Box>
      </Box>
    </FormContentContainer>
  )
}

export default DefendantForm
