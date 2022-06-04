import React from 'react'
import { Box, Text } from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

export const ElectionStatement = () => {
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Text variant="default" as="p">
        {formatMessage(m.elctionStatementLaw)}
      </Text>
    </Box>
  )
}
