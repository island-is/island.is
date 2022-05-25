import React, { FC } from 'react'
import cn from 'classnames'
import { Box } from '../../Box/Box'
import * as styles from './GridContainer.css'

type position = 'relative' | 'fixed' | 'absolute'
export interface GridContainerProps {
  className?: string
  id?: string
  position?: position | 'none'
}

export const GridContainer: FC<GridContainerProps> = ({
  children,
  className,
  id,
  position = 'relative',
}) => {
  const pos: { position?: position } = {}

  if (position !== 'none') {
    pos.position = position
  }
  return (
    <Box {...pos} className={cn(className, styles.root)} id={id}>
      {children}
    </Box>
  )
}
