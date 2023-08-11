import React from 'react'
import { useIntl } from 'react-intl'

import { AlertMessage, Box } from '@island.is/island-ui/core'

import { defenderNotFound as m } from './DefenderNotFound.strings'

const DefenderNotFound: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { formatMessage } = useIntl()
  return (
    <Box marginBottom={3} data-testid="defenderNotFound">
      <AlertMessage
        type="warning"
        title={formatMessage(m.title)}
        message={formatMessage(m.message)}
      />
    </Box>
  )
}

export default DefenderNotFound
