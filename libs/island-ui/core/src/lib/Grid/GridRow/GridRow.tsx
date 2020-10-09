import React, { FC } from 'react'
import cn from 'classnames'
import { Box } from '../../Box/Box'
import * as styles from './GridRow.treat'
import { ResponsiveProp } from '../../../utils/responsiveProp'
import * as styleRefs from '../../Box/useBoxStyles.treat'

interface Props {
  className?: string
  direction?: ResponsiveProp<keyof typeof styleRefs.flexDirection>
}

export const GridRow: FC<Props> = ({
  children,
  className,
  direction = 'row',
}) => {
  return (
    <Box flexDirection={direction} className={cn(className, styles.gridRow)}>
      {children}
    </Box>
  )
}
