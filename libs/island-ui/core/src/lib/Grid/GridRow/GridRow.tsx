import React, { FC } from 'react'
import cn from 'classnames'
import { Box } from '../../Box/Box'
import * as styles from './GridRow.treat'
import { ResponsiveProp } from '../../../utils/responsiveProp'
import { flexDirection, justifyContent } from '../../Box/useBoxStyles.treat'

interface Props {
  className?: string
  direction?: ResponsiveProp<keyof typeof flexDirection>
  align?: ResponsiveProp<keyof typeof justifyContent>
}

export const GridRow: FC<Props> = ({
  children,
  className,
  direction = 'row',
  align,
}) => {
  return (
    <Box
      flexDirection={direction}
      justifyContent={align}
      className={cn(className, styles.gridRow)}
    >
      {children}
    </Box>
  )
}
