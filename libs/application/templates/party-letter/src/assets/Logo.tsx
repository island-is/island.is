import React, { FC } from 'react'
import { Box, Text, Hyphen } from '@island.is/island-ui/core'
import { m } from '../lib/messages'
import { useLocale } from '@island.is/localization'
import { ReactComponent as CoatOfARms } from './coat_of_arms.svg'

const Logo: FC = () => {
  const { formatMessage } = useLocale()

  return (
    <Box display="flex" alignItems="center">
      <CoatOfARms title="smu" />
      <Box marginLeft={2}>
        <Text variant="eyebrow">{formatMessage(m.logo.service)}</Text>
        <Text variant="h5">
          <Hyphen>{formatMessage(m.logo.organization)}</Hyphen>
        </Text>
      </Box>
    </Box>
  )
}

export default Logo
