import React, { FC, ReactNode } from 'react'
import cn from 'classnames'
import { Box } from '../Box/Box'
import * as styles from './Badge.treat'

interface BadgeProps {
  number?: number
  children?: ReactNode
}

export const Badge: FC<BadgeProps> = ({ number, children }) => {
  if (!number) {
    return null
  }

  return (
    <Box position="relative">
      {children}
      <Box
        position="absolute"
        display="flex"
        alignItems="center"
        textAlign="center"
        background="red400"
        justifyContent="center"
        pointerEvents="none"
        className={cn(styles.badge, styles.position)}
      >
        {number}
      </Box>
    </Box>
  )
}

export default Badge
