import { FC, useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import { CaseState } from '@island.is/judicial-system-web/src/graphql/schema'

import CourtCaseNumberCurrentCaseInput from './CourtCaseNumberInput'
import { strings } from './CourtCaseNumber.strings'

const CourtCaseNumber: FC = () => {
  const { formatMessage } = useIntl()
  const { workingCase } = useContext(FormContext)

  return (
    <>
      <Box marginBottom={2}>
        <Text as="h2" variant="h3">
          {formatMessage(strings.title)}
        </Text>
      </Box>
      <Box marginBottom={2}>
        <Text>
          {workingCase.state !== CaseState.SUBMITTED &&
          workingCase.state !== CaseState.WAITING_FOR_CANCELLATION &&
          workingCase.state !== CaseState.RECEIVED
            ? formatMessage(strings.explanationDisabled)
            : formatMessage(strings.explanation)}
        </Text>
      </Box>
      <CourtCaseNumberCurrentCaseInput />
    </>
  )
}

export default CourtCaseNumber
