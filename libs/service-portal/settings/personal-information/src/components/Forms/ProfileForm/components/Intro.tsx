import React, { FC } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Text, Divider, Box } from '@island.is/island-ui/core'
import { msg } from '../../../../lib/messages'

interface Props {
  name: string
}

export const OnboardingIntro: FC<Props> = ({ name }) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  return (
    <Box>
      <Text variant="h2" as="h1" marginBottom={1}>
        {name}
      </Text>
      <Text marginBottom={4}>{formatMessage(msg.overlayIntro)}</Text>
      <Divider />
    </Box>
  )
}
