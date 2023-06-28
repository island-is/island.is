import React, { ReactNode } from 'react'

import { Box, Stack, Text } from '@island.is/island-ui/core'

interface BaseCardProps {
  cta?: ReactNode
  bgGrey?: boolean
}

interface TitleOnlyProps extends BaseCardProps {
  title: string
  description?: never
}

interface DescOnlyProps extends BaseCardProps {
  title?: never
  description: string
}

interface TitleAndDescProps extends BaseCardProps {
  title: string
  description: string
}

type CardProps = TitleOnlyProps | DescOnlyProps | TitleAndDescProps

export const Card = ({
  title,
  description,
  cta,
  bgGrey = false,
}: CardProps) => (
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
      {title && <Text variant="h3">{title}</Text>}
      {description && <Text variant="default">{description}</Text>}
    </Stack>
    {cta && (
      <Box height="full" display="flex" style={{ alignSelf: 'flex-end' }}>
        {cta}
      </Box>
    )}
  </Box>
)
