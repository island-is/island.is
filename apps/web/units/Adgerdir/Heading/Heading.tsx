import React, { FC } from 'react'
import { Box, Text, TextProps } from '@island.is/island-ui/core'

interface HeadingProps {
  variant?: TextProps['variant']
  as?: TextProps['as']
}

export const Heading: FC<HeadingProps> = ({
  variant = 'h3',
  as = 'h3',
  children,
}) => {
  return (
    <Box marginTop={4} marginBottom={1}>
      <Text variant={variant} as={as}>
        {children}
      </Text>
    </Box>
  )
}

export default Heading
