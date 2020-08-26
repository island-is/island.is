import React, { FC } from 'react'
import cn from 'classnames'
import { Box } from '../../Box/Box'
import {
  resolveResponsiveProp,
  ResponsiveProp,
} from '../../../utils/responsiveProp'
import * as styleRefs from './GridColumn.treat'
import { ResponsiveSpace } from '../../Box/useBoxStyles'

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface TilesProps {
  span: ResponsiveProp<GridColumns>
  offset?: ResponsiveProp<GridColumns>
  paddingBottom?: ResponsiveSpace
  paddingTop?: ResponsiveSpace
}

export const GridColumn: FC<TilesProps> = ({
  children,
  span = 1,
  offset = 0,
  paddingBottom = 0,
  paddingTop = 0,
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
          paddingBottom,
          styles.paddingBottomXs,
          styles.paddingBottomSm,
          styles.paddingBottomMd,
          styles.paddingBottomLg,
          styles.paddingBottomXl,
        ),
        resolveResponsiveProp(
          paddingTop,
          styles.paddingTopXs,
          styles.paddingTopSm,
          styles.paddingTopMd,
          styles.paddingTopLg,
          styles.paddingTopXl,
        ),
      )}
    >
      {children}
    </Box>
  )
}
