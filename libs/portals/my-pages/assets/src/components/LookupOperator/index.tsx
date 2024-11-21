import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'

import { vehicleMessage as messages } from '../../lib/messages'
import { OperatorAnonymityStatus } from '@island.is/api/schema'

interface PropTypes {
  names?: string[]
  operatorAnonymityStatus?: OperatorAnonymityStatus
}

const LookupOperator = ({ names, operatorAnonymityStatus }: PropTypes) => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()

  if (operatorAnonymityStatus === OperatorAnonymityStatus.ALL) {
    return <span>{formatMessage(messages.anonymous)}</span>
  }

  if (names?.length) {
    return (
      <div>
        {names?.map((name, i) => (
          <React.Fragment key={i}>
            {i + 1}. {name}
            <br />
          </React.Fragment>
        ))}
        {operatorAnonymityStatus === OperatorAnonymityStatus.SOME ? (
          <Box marginTop={1}>
            <Text variant="small">
              {formatMessage(messages.anonymousPartial)}
            </Text>
          </Box>
        ) : undefined}
      </div>
    )
  }

  return ''
}

export default LookupOperator
