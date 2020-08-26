import React, { FC } from 'react'
import cn from 'classnames'
import { Box } from '../Box'
import {
  resolveResponsiveProp,
  ResponsiveProp,
} from '../../utils/responsiveProp'
import * as styles from './Grid.treat'

interface Props {
  columns?: ResponsiveProp<number>
  className?: any
}

export const Grid: FC<Props> = ({ children, columns = 9, className }) => {
  return (
    <Box
      className={cn(
        className,
        styles.grid,
        resolveResponsiveProp(
          columns,
          styles.columnsXs,
          styles.columnsSm,
          styles.columnsMd,
          styles.columnsLg,
          styles.columnsXl,
        ),
      )}
    >
      {children}
    </Box>
  )
}
