import React, { FC } from 'react'
import cn from 'classnames'
import { Box } from '../../Box/Box'
import { BoxProps } from '../../Box/types'
import * as styles from './GridRow.css'
import { ResponsiveProp } from '../../../utils/responsiveProp'
import { flexDirection, justifyContent } from '../../Box/useBoxStyles.css'

interface Props {
  className?: string
  direction?: ResponsiveProp<keyof typeof flexDirection>
  align?: ResponsiveProp<keyof typeof justifyContent>
  alignItems?: BoxProps['alignItems']
  marginTop?: BoxProps['marginTop']
  marginBottom?: BoxProps['marginBottom']
  rowGap?: BoxProps['rowGap']
}

export const GridRow: FC<React.PropsWithChildren<Props>> = ({
  children,
  className,
  direction = 'row',
  align,
  alignItems,
  ...props
}) => {
  return (
    <Box
      flexDirection={direction}
      justifyContent={align}
      alignItems={alignItems}
      className={cn(className, styles.gridRow)}
      {...props}
    >
      {children}
    </Box>
  )
}
