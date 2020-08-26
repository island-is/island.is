import React, { FC } from 'react'
import cn from 'classnames'
import { Box } from '../Box/Box'
import {
  resolveResponsiveProp,
  ResponsiveProp,
} from '../../utils/responsiveProp'
import * as styleRefs from './GridItem.treat'
import { ResponsiveSpace } from '../Box/useBoxStyles'

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface TilesProps {
  span: ResponsiveProp<GridColumns>
  offset?: ResponsiveProp<GridColumns>
  bottom?: ResponsiveSpace
  top?: ResponsiveSpace
}

export const GridItem: FC<TilesProps> = ({
  children,
  span = 1,
  offset = 0,
  bottom = 0,
  top = 0,
}) => {
  const styles = {
    ...styleRefs,
  }

  return (
    <Box
      className={cn(
        styles.base,
        resolveResponsiveProp(
          span,
          styles.spanXs,
          styles.spanSm,
          styles.spanMd,
          styles.spanLg,
          styles.spanXl,
        ),
        resolveResponsiveProp(
          offset,
          styles.offsetXs,
          styles.offsetSm,
          styles.offsetMd,
          styles.offsetLg,
          styles.offsetXl,
        ),
        resolveResponsiveProp(
          bottom,
          styles.bottomXs,
          styles.bottomSm,
          styles.bottomMd,
          styles.bottomLg,
          styles.bottomXl,
        ),
        resolveResponsiveProp(
          top,
          styles.bottomXs,
          styles.bottomSm,
          styles.bottomMd,
          styles.bottomLg,
          styles.bottomXl,
        ),
      )}
    >
      {children}
    </Box>
  )
}
