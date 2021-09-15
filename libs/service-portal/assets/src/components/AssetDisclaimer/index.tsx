import React from 'react'
import { useLocale } from '@island.is/localization'
import { Box } from '@island.is/island-ui/core'
import { messages } from '../../lib/messages'

const AssetDisclaimer = () => {
  const { formatMessage } = useLocale()
  return (
    <Box>
      <p style={{ marginTop: 32, fontWeight: 100 }}>
        {formatMessage(messages.disclaimerA)}
      </p>
      <p style={{ marginTop: 24, fontWeight: 100 }}>
        {formatMessage(messages.disclaimerB)}
      </p>
    </Box>
  )
}

export default AssetDisclaimer
