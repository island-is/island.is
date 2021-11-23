import React from 'react'
import { useLocale } from '@island.is/localization'
import { Box, Text } from '@island.is/island-ui/core'
import { messages } from '../../lib/messages'

const AssetDisclaimer = () => {
  const { formatMessage } = useLocale()
  return (
    <Box>
      <Text paddingTop={4}>{formatMessage(messages.disclaimerA)}</Text>
      <Text paddingTop={3}>{formatMessage(messages.disclaimerB)}</Text>
    </Box>
  )
}

export default AssetDisclaimer
