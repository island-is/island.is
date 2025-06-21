import { ReactNode } from 'react'

import { Box, Text } from '@island.is/island-ui/core'

type TextNode = string | ReactNode

export type VerifyHeaderProps = {
  label: TextNode
  title: TextNode
  intro: TextNode
  subtitle?: ReactNode
}

export const VerifyHeader = ({
  label,
  title,
  intro,
  subtitle,
}: VerifyHeaderProps) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    width="full"
    textAlign="center"
    rowGap={2}
  >
    <Text color="blue400" variant="eyebrow">
      {label}
    </Text>
    <Text variant="h2" as="h1">
      {title}
    </Text>
    <Text variant="default">{intro}</Text>
    {subtitle}
  </Box>
)
