import React, { FC } from 'react'
import cn from 'classnames'
import { Box } from '../../Box'
import * as styles from './GridRow.treat'

interface Props {
  className?: any
}

export const GridRow: FC<Props> = ({ children, className }) => {
  return <Box className={cn(className, styles.grid)}>{children}</Box>
}
