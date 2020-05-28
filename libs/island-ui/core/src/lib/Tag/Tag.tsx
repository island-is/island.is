import React, { forwardRef } from 'react'
import cn from 'classnames'
import { Typography, Box } from '../..'
import * as styles from './Tag.treat'

export type TagVariant = 'blue' | 'purple'

export interface TagProps {
  onClick?: () => void
  variant?: TagVariant
  children: string
}

export const Tag = forwardRef<HTMLButtonElement, TagProps>(
  ({ children, variant = 'blue', ...props }: TagProps, ref) => {
    return (
      <Box
        component="button"
        display="inlineBlock"
        ref={ref}
        paddingY="smallGutter"
        paddingX={1}
        className={cn(styles.container, styles.variant[variant])}
        tabIndex={-1}
        {...props}
      >
        <Typography variant="tag" as="span">
          {children}
        </Typography>
      </Box>
    )
  },
)
