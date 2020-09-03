import React, { FC } from 'react'
import cn from 'classnames'
import { Box } from '../../Box/Box'
import {
  resolveResponsiveProp,
  ResponsiveProp,
} from '../../../utils/responsiveProp'
import * as styles from './GridColumn.treat'
import { ResponsiveSpace } from '../../Box/useBoxStyles'

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface TilesProps {
  span?: ResponsiveProp<GridColumns>
  offset?: ResponsiveProp<GridColumns>
  paddingBottom?: ResponsiveSpace
  paddingTop?: ResponsiveSpace
  className?: string
}

export const GridColumn: FC<TilesProps> = ({
  children,
  span,
  offset,
  paddingBottom,
  paddingTop,
  className,
}) => (
  <Box
    paddingTop={paddingTop}
    paddingBottom={paddingBottom}
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
