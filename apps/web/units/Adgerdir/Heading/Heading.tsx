import React, { FC } from 'react'
import { Box, Typography, TypographyProps } from '@island.is/island-ui/core'

interface HeadingProps {
  variant?: TypographyProps['variant']
  as?: TypographyProps['as']
}

export const Heading: FC<HeadingProps> = ({
  variant = 'h3',
  as = 'h3',
  children,
}) => {
  return (
    <Box marginTop={4} marginBottom={1}>
      <Typography variant={variant} as={as}>
        {children}
      </Typography>
    </Box>
  )
}

export default Heading
