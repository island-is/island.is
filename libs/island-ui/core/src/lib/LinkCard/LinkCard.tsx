import React, { forwardRef } from 'react'
import { Box } from '../Box/Box'
import { Typography } from '../Typography/Typography'

export interface LinkCardProps {
  onClick?: () => void
  children: string
}

export const LinkCard = forwardRef<HTMLAnchorElement, LinkCardProps>(
  ({ onClick, children }: LinkCardProps, ref) => {
    return (
      <Box
        background="blue100"
        borderRadius="large"
        display="flex"
        onClick={onClick}
        padding={[2, 2, 3]}
        ref={ref}
        width="full"
      >
        <Typography variant="h4" as="span" color="blue400">
          {children}
        </Typography>
      </Box>
    )
  },
)
