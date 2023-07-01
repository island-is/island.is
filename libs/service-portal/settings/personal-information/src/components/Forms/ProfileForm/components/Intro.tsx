import React, { FC } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { Text, Divider, Box } from '@island.is/island-ui/core'
import { msg } from '../../../../lib/messages'

interface Props {
  name: string
  showIntroTitle?: boolean
}

export const OnboardingIntro: FC<React.PropsWithChildren<Props>> = ({
  name,
  showIntroTitle,
}) => {
  useNamespaces('sp.settings')
  const { formatMessage } = useLocale()
  return (
    <Box>
      {showIntroTitle && (
        <>
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
        </>
      )}
      <Text marginBottom={4}>{formatMessage(msg.overlayIntro)}</Text>
      <Divider />
    </Box>
  )
}
