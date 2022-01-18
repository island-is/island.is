import React, { FC } from 'react'
import { Text, Divider, Box } from '@island.is/island-ui/core'

interface Props {
  name: string
}

export const OnboardingIntro: FC<Props> = ({ name }) => {
  return (
    <Box>
      <Text
        variant="eyebrow"
        marginBottom={2}
        fontWeight="semiBold"
        color="purple400"
      >
        Góða kvöldið,
      </Text>
      <Text variant="h2" as="h1" marginBottom={1}>
        {name}
      </Text>
      <Text marginBottom={4}>
        Vinsamlegast farðu vel yfir allar neðangreindarupplýsingar, gangtu í
        skugga um að þær séu réttar og gerðu breytingar ef þörf krefur.
      </Text>
      <Divider />
    </Box>
  )
}
