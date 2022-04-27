import React from 'react'
import { useIntl } from 'react-intl'

import { AlertMessage, Box } from '@island.is/island-ui/core'
import { status } from '../../../lib/messages'

const SpouseAlert = () => {
  const { formatMessage } = useIntl()

  return (
    <Box marginBottom={[4, 4, 5]}>
      <AlertMessage
        type="warning"
        title={formatMessage(status.spouseAlert.title)}
        message={formatMessage(status.spouseAlert.message)}
      />
    </Box>
  )
}

export default SpouseAlert
