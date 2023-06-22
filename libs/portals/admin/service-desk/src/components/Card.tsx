import React, { ReactNode } from 'react'

import { Box, Stack, Text } from '@island.is/island-ui/core'

interface ContentCardProps {
  title: string
  description: string
  cta?: ReactNode
  bgGrey?: boolean
}

export const Card = ({
  title,
  description,
  cta,
  bgGrey = false,
}: ContentCardProps) => (
  <Box
    display="flex"
    borderRadius="large"
    width="full"
    paddingX={4}
    paddingY={3}
    justifyContent="spaceBetween"
    alignItems="center"
    {...(bgGrey ? { background: 'dark100' } : { border: 'standard' })}
  >
    <Stack space={1}>
      <Text variant="h3">{title}</Text>
      <Text variant="default">{description}</Text>
    </Stack>
    {cta && (
      <Box height="full" display="flex" style={{ alignSelf: 'flex-end' }}>
        {cta}
      </Box>
    )}
  </Box>
)
