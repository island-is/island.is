import React, { FC } from 'react'

import { Box,Divider, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'

import { msg } from '../../../../lib/messages'

interface Props {
  name: string
}

export const OnboardingIntro: FC<Props> = ({ name }) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  return (
    <Box>
      <Text
        variant="eyebrow"
        marginBottom={2}
        fontWeight="semiBold"
        color="purple400"
      >
        {formatMessage(m.hi)},
      </Text>
      <Text variant="h2" as="h1" marginBottom={1}>
        {name}
      </Text>
      <Text marginBottom={4}>{formatMessage(msg.overlayIntro)}</Text>
      <Divider />
    </Box>
  )
}
