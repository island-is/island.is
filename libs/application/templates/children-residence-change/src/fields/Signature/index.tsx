import React from 'react'
import { useIntl } from 'react-intl'
import { Box, Text } from '@island.is/island-ui/core'
import { signature } from '../../lib/messages'

const Signature = () => {
  const { formatMessage } = useIntl()
  return (
    <>
      <Box marginTop={3}>
        <Text variant="h2" marginTop={3}>
          {formatMessage(signature.security.numberLabel)}{' '}
          <span style={{ color: 'blue' }}>1234</span>
        </Text>
        <Text marginTop={2}>{formatMessage(signature.security.message)}</Text>
      </Box>
    </>
  )
}

export default Signature
