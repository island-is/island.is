import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { FinancialStatementsInao } from '../../lib/utils/dataSchema'
import { format as formatNationalId } from 'kennitala'
import { ELECTIONLIMIT } from '../../lib/constants'
import { formatNumber } from '../../lib/utils/helpers'

export const ElectionStatement = ({ application }: FieldBaseProps) => {
  const { formatMessage } = useLocale()

  const answers = application.answers as FinancialStatementsInao

  return (
    <Box>
      <Box paddingBottom={2}>
        <Text>
          {`${answers.about.fullName},
          ${formatMessage(m.nationalId)}: ${formatNationalId(
            answers.about.nationalId,
          )}, ${formatMessage(m.participated)} 
          ${answers.election.selectElection}`}
        </Text>
      </Box>
      <Box paddingY={2}>
        <Text>{`${formatMessage(m.electionDeclare)} ${formatNumber(
          ELECTIONLIMIT,
        )}`}</Text>
      </Box>
      <Box paddingY={2}>
        <Text>{formatMessage(m.electionStatementLaw)}</Text>
      </Box>
    </Box>
  )
}
