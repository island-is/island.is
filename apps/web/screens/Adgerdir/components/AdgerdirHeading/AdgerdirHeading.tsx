import React, { FC } from 'react'
import { Stack, Text, TextProps } from '@island.is/island-ui/core'

export interface AdgerdirHeadingProps {
  subtitle?: string
  title?: string
  intro?: string
  as?: TextProps['as']
  variant?: TextProps['variant']
  main?: boolean
}

export const AdgerdirHeading: FC<
  React.PropsWithChildren<AdgerdirHeadingProps>
> = ({ subtitle, title, intro, as = 'h1', variant = 'h1', main = false }) => {
  if (!subtitle || !title || !intro) {
    return null
  }

  return (
    <Stack space={2}>
      {subtitle ? (
        <Text variant="eyebrow" as="div" color="purple400">
          {subtitle}
        </Text>
      ) : null}
      {title ? (
        <Text variant={variant} as={as}>
          {title}
        </Text>
      ) : null}
      {intro ? (
        <Text variant={main ? 'intro' : 'default'} as="p">
          {intro}
        </Text>
      ) : null}
    </Stack>
  )
}

export default AdgerdirHeading
