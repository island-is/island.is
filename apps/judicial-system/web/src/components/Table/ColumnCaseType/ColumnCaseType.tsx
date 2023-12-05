import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import { tables } from '@island.is/judicial-system-web/messages'
import {
  CaseDecision,
  CaseType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { displayCaseType } from '@island.is/judicial-system-web/src/routes/Shared/Cases/utils'

interface Props {
  type: CaseType
  decision?: CaseDecision
  parentCaseId?: string
}

const ColumnCaseType: React.FC<Props> = ({ type, decision, parentCaseId }) => {
  const { formatMessage } = useIntl()

  return (
    <Box component="span" display="flex" flexDirection="column">
      <Text as="span">{displayCaseType(formatMessage, type, decision)}</Text>
      {parentCaseId && (
        <Text as="span" variant="small" color="dark400">
          {formatMessage(tables.extension)}
        </Text>
      )}
    </Box>
  )
}

export default ColumnCaseType
