import React, { FC } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '@island.is/service-portal/core'
import { Text, Divider, Box } from '@island.is/island-ui/core'

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
      <Text marginBottom={4}>
        {formatMessage({
          id: 'sp.settings:overlay-intro-text',
          defaultMessage: `Vinsamlegast farðu vel yfir allar neðangreindarupplýsingar, gangtu í
          skugga um að þær séu réttar og gerðu breytingar ef þörf krefur.`,
        })}
      </Text>
      <Divider />
    </Box>
  )
}
