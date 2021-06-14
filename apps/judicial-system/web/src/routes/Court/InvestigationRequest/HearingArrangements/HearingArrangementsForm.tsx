import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import {
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import { Case } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isLoading: boolean
}

const HearingArrangementsForm: React.FC<Props> = (props) => {
  const { workingCase, isLoading } = props

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Fyrirtaka
          </Text>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.R_CASE_OVERVIEW}/${workingCase.id}}`}
          nextIsLoading={isLoading}
          nextUrl={`${Constants.R_CASE_COURT_RECORD_ROUTE}/${workingCase.id}`}
        />
      </FormContentContainer>
    </>
  )
}

export default HearingArrangementsForm
