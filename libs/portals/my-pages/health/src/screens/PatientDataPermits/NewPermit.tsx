import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import React from 'react'
import { messages } from '../../lib/messages'

const NewPermit: React.FC = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Text variant="eyebrow" color="purple400">
        {formatMessage(messages.chooseDataToShare)}
      </Text>
      <Text>{formatMessage(messages.chooseDataToShare)}</Text>
    </Box>
  )
}

export default NewPermit
