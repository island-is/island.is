import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { FormContentContainer } from '@island.is/judicial-system-web/src/shared-components'
import { Case } from '@island.is/judicial-system/types'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isLoading: boolean
}

const OverviewForm: React.FC<Props> = (props) => {
  const { workingCase } = props

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Yfirlit kröfu um rannsóknarheimild
          </Text>
        </Box>
      </FormContentContainer>
    </>
  )
}

export default OverviewForm
