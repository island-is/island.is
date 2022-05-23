import React from 'react'
import { useIntl } from 'react-intl'

import { AlertMessage, Box } from '@island.is/island-ui/core'
import { spouseAlert } from '../../../lib/messages'

const SpouseAlert = () => {
  const { formatMessage } = useIntl()

  return (
    <Box marginBottom={[4, 4, 5]}>
      <AlertMessage
        type="warning"
        title={formatMessage(spouseAlert.title)}
        message={formatMessage(spouseAlert.message)}
      />
    </Box>
  )
}

export default SpouseAlert
