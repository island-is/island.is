import React, { FC } from 'react'
import cn from 'classnames'
import { theme } from '@island.is/island-ui/theme'
import { Box } from '../../Box/Box'
import {
  resolveResponsiveProp,
  ResponsiveProp,
} from '../../../utils/responsiveProp'
import {
  resolveResponsiveRangeProps,
  ResponsiveRangeProps,
} from '../../../utils/responsiveRangeProps'

import * as styles from './GridColumn.treat'
import { ResponsiveSpace } from '../../Box/useBoxStyles'
import { GridColumns } from './GridColumn.treat'

type Breakpoint = keyof typeof theme['breakpoints']

export interface GridColumnProps extends ResponsiveRangeProps {
  span?: ResponsiveProp<GridColumns>
  offset?: ResponsiveProp<GridColumns>
  paddingBottom?: ResponsiveSpace
  paddingTop?: ResponsiveSpace
  className?: string
  hideAbove?: Exclude<Breakpoint, 'xl'>
  hideBelow?: Exclude<Breakpoint, 'xs'>
}

export const GridColumn: FC<GridColumnProps> = ({
  children,
  span,
  offset,
  paddingBottom,
  paddingTop,
  className,
  hideAbove: above,
  hideBelow: below,
}) => {

  const [
    hiddenOnXs,
    hiddenOnSm,
    hiddenOnMd,
    hiddenOnLg,
    hiddenOnXl,
  ] = resolveResponsiveRangeProps({ above, below })
  return (
    <Box
      paddingTop={paddingTop}
      paddingBottom={paddingBottom}
      display={[
        hiddenOnXs ? 'none' : 'block',
        hiddenOnSm ? 'none' : 'block',
        hiddenOnMd ? 'none' : 'block',
        hiddenOnLg ? 'none' : 'block',
        hiddenOnXl ? 'none' : 'block',
      ]}
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
      )}
    >
      {children}
    </Box>
  )
}
