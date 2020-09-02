import React, { FC } from 'react'
import { Stack, Typography, TypographyProps } from '@island.is/island-ui/core'

export interface HeadingProps {
  subtitle?: string
  title?: string
  intro?: string
  as?: TypographyProps['as']
  variant?: TypographyProps['variant']
  main?: boolean
}

export const Heading: FC<HeadingProps> = ({
  subtitle,
  title,
  intro,
  as = 'h1',
  variant = 'h1',
  main = false,
}) => {
  if (!subtitle || !title || !intro) {
    return null
  }

  return (
    <Stack space={3}>
      {subtitle ? (
        <Typography variant="eyebrow" as="div" color="purple400">
          {subtitle}
        </Typography>
      ) : null}
      {title ? (
        <Typography variant={variant} as={as}>
          {title}
        </Typography>
      ) : null}
      {intro ? (
        <Typography variant={main ? 'intro' : 'p'} as="p">
          {intro}
        </Typography>
      ) : null}
    </Stack>
  )
}

export default Heading
