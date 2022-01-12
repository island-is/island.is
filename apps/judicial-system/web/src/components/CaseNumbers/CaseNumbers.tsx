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
        <Text variant="h2" as="h2">
          {formatMessage(core.caseNumber, {
            caseNumber: workingCase.courtCaseNumber,
          })}
        </Text>
      </Box>
      <Text fontWeight="semiBold">{`${formatMessage(core.prosecutor)}: ${
        workingCase.prosecutor?.institution?.name
      }`}</Text>
      {workingCase.defendants && (
        <Text fontWeight="semiBold">{`${formatMessage(core.accused, {
          suffix: workingCase.defendants.length > 0 ? 'ar' : 'i',
        })}:${workingCase.defendants.map(
          (defendant) => ` ${defendant.name}`,
        )}`}</Text>
      )}
    </>
  )
}

export default CaseNumbers
