import React, { forwardRef } from 'react'
import { Typography, Box } from '../..'
import * as styles from './LinkCard.treat'

export interface LinkCardProps {
  onClick?: () => void
  disabled?: boolean
  children: string
}

export const LinkCard = forwardRef<HTMLButtonElement, LinkCardProps>(
  ({ onClick, disabled, children, ...props }: LinkCardProps, ref) => {
    return (
      <Box
        component="a"
        ref={ref}
        disabled={disabled}
        display="flex"
        width="full"
        onClick={onClick}
        padding={[2, 2, 3]}
        className={styles.container}
        {...props}
      >
        <Typography variant="h4" as="span">
          {children}
        </Typography>
      </Box>
    )
  },
)
