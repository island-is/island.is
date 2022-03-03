import React from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'

import { messages } from '../../lib/messages'

const AssetDisclaimer = () => {
  const { formatMessage } = useLocale()
  return (
    <Box>
      <Text variant="small" paddingTop={4}>
        {formatMessage(messages.disclaimerA)}
      </Text>
      <Text variant="small" paddingTop={3}>
        {formatMessage(messages.disclaimerB)}
      </Text>
    </Box>
  )
}

export default AssetDisclaimer
