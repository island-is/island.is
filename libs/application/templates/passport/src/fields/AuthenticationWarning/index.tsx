import React from 'react'
import { AlertBanner, Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

const AuthenticationWarning = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <AlertBanner
        description={formatMessage(m.noAuthenticationWarning)}
        variant="warning"
      />
    </Box>
  )
}

export default AuthenticationWarning
