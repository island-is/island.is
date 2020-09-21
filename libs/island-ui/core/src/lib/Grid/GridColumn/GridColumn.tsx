import React, { FC } from 'react'
import cn from 'classnames'
import { theme } from '@island.is/island-ui/theme'

import { Box } from '../../Box/Box'
import { ResponsiveSpace } from '../../Box/useBoxStyles'
import {
  resolveResponsiveProp,
  ResponsiveProp,
} from '../../../utils/responsiveProp'
import * as styles from './GridColumn.treat'

type Breakpoint = keyof typeof theme['breakpoints']
type position = 'relative' | 'fixed' | 'absolute'

export type SpanType = ResponsiveProp<styles.GridColumns>
export interface GridColumnProps {
  span?: ResponsiveProp<styles.GridColumns>
  offset?: ResponsiveProp<styles.GridColumns>
  order?: ResponsiveProp<styles.Order>
  paddingBottom?: ResponsiveSpace
  paddingTop?: ResponsiveSpace
  className?: string
  hiddenAbove?: Exclude<Breakpoint, 'xl'>
  hiddenBelow?: Exclude<Breakpoint, 'xs'>
  position?: position | 'none'
}

export const GridColumn: FC<GridColumnProps> = ({
  children,
  span,
  offset,
  order,
  paddingBottom,
  paddingTop,
  className,
  hiddenAbove,
  hiddenBelow,
  position = 'relative',
}) => {
  const pos: { position?: position } = {}

  if (position !== 'none') {
    pos.position = position
  }

  return (
    <Box
      {...pos}
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
      hiddenAbove={hiddenAbove}
      hiddenBelow={hiddenBelow}
      className={cn(
        className,
        styles.base,
        span !== undefined &&
          resolveResponsiveProp(
            span,
            styles.spanXs,
            styles.spanSm,
            styles.spanMd,
            styles.spanLg,
            styles.spanXl,
          ),
        offset !== undefined &&
          resolveResponsiveProp(
            offset,
            styles.offsetXs,
            styles.offsetSm,
            styles.offsetMd,
            styles.offsetLg,
            styles.offsetXl,
          ),
        order !== undefined &&
          resolveResponsiveProp(
            order,
            styles.orderXs,
            styles.orderSm,
            styles.orderMd,
            styles.orderLg,
            styles.orderXl,
          ),
      )}
    >
      {children}
    </Box>
  )
}
