import { FC, useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import { CaseState } from '@island.is/judicial-system-web/src/graphql/schema'

import CourtCaseNumberInput from './CourtCaseNumberInput'
import { courtCaseNumber } from './CourtCaseNumber.strings'

const CourtCaseNumber: FC = () => {
  const { formatMessage } = useIntl()
  const { workingCase, setWorkingCase } = useContext(FormContext)

  return (
    <>
      <Box marginBottom={2}>
        <Text as="h2" variant="h3">
          {formatMessage(courtCaseNumber.title)}
        </Text>
      </Box>
      <Box marginBottom={2}>
        <Text>
          {workingCase.state !== CaseState.SUBMITTED &&
          workingCase.state !== CaseState.WAITING_FOR_CANCELLATION &&
          workingCase.state !== CaseState.RECEIVED
            ? formatMessage(courtCaseNumber.explanationDisabled)
            : formatMessage(courtCaseNumber.explanation)}
        </Text>
      </Box>
      <CourtCaseNumberInput
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
      />
    </>
  )
}

export default CourtCaseNumber
