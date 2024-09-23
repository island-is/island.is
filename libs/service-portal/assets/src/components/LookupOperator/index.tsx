import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'

import { vehicleMessage as messages } from '../../lib/messages'

interface PropTypes {
  names: string[]
  allOperatorsAreAnonymous: boolean
  someOperatorsAreAnonymous: boolean
}

const LookupOperator = ({
  names,
  allOperatorsAreAnonymous,
  someOperatorsAreAnonymous,
}: PropTypes) => {
  useNamespaces('sp.vehicles')
  const { formatMessage } = useLocale()

  if (
    !names.length &&
    !allOperatorsAreAnonymous &&
    !someOperatorsAreAnonymous
  ) {
    return ''
  }

  if (allOperatorsAreAnonymous) {
    return <span>{formatMessage(messages.anonymous)}</span>
  }

  return (
    <div>
      {names?.map((name, i) => (
        <React.Fragment key={i}>
          {i + 1}. {name}
          <br />
        </React.Fragment>
      ))}
      {someOperatorsAreAnonymous ? (
        <Box marginTop={1}>
          <Text variant="small">
            {formatMessage(messages.anonymousPartial)}
          </Text>
        </Box>
      ) : (
        ''
      )}
    </div>
  )
}

export default LookupOperator
