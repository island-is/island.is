import { FC, useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { FormContext } from '@island.is/judicial-system-web/src/components'

import { strings } from './CaseNumbers.strings'

const CaseNumbers: FC = () => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()

  if (!workingCase.appealCaseNumber) {
    return (
      <Text as="h3" variant="default" fontWeight="semiBold" marginBottom={1}>
        {formatMessage(strings.courtOfAppealCaseNumber, {
          caseNumber: workingCase.courtCaseNumber,
        })}
      </Text>
    )
  }

  return (
    <Box marginBottom={7}>
      <Text as="h2" variant="h2">
        {formatMessage(strings.caseNumber, {
          caseNumber: `${workingCase.appealCaseNumber}`,
        })}
      </Text>
      <Text as="h3" variant="default" fontWeight="semiBold">
        {formatMessage(strings.courtOfAppealCaseNumber, {
          caseNumber: workingCase.courtCaseNumber,
        })}
      </Text>
    </Box>
  )
}

export default CaseNumbers
