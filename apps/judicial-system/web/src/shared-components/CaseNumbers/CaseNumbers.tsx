import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import type { Case } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import React from 'react'

interface Props {
  workingCase: Case
}

const CaseNumbers: React.FC<Props> = ({ workingCase }: Props) => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Box marginBottom={1}>
        <Text variant="h2" as="h2">{`${formatMessage(core.caseNumber)} ${
          workingCase.courtCaseNumber
        }`}</Text>
      </Box>
      <Text fontWeight="semiBold">{`${formatMessage(core.prosecutor)}: ${
        workingCase.court?.name
      }`}</Text>
      {workingCase.defenderName && (
        <Text fontWeight="semiBold">{`${
          workingCase.defenderIsSpokesperson
            ? formatMessage(core.spokeperson)
            : formatMessage(core.defender)
        }: ${workingCase.defenderName}`}</Text>
      )}
    </>
  )
}

export default CaseNumbers
