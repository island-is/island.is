import React, { ReactNode, useContext } from 'react'
import cn from 'classnames'
import {
  resolveResponsiveProp,
  ResponsiveProp,
} from '../../utils/responsiveProp'
import { Box } from '../Box/Box'
import { ColumnsContext } from '../Columns/Columns'
import * as styles from './Column.treat'

export interface ColumnProps {
  children: ReactNode
  width?: ResponsiveProp<styles.AvailableWidths>
}

/** Standard columns */
export const Column = ({ children, width }: ColumnProps) => {
  const {
    collapseXs,
    collapseSm,
    collapseMd,
    collapseLg,
    xsSpace,
    smSpace,
    mdSpace,
    lgSpace,
    xlSpace,
    collapsibleAlignmentChildProps,
  } = useContext(ColumnsContext)
  const isFluid = width === undefined

  return (
    <Box
      minWidth={0}
      width={isFluid ? 'full' : undefined}
      className={cn(
        styles.column,
        !isFluid &&
          resolveResponsiveProp(
            width,
            styles.widthXs,
            styles.widthSm,
            styles.widthMd,
            styles.widthLg,
            styles.widthXl,
          ),
      )}
    >
      <Box
        paddingLeft={[
          collapseXs ? 'none' : xsSpace,
          collapseSm ? 'none' : smSpace,
          collapseMd ? 'none' : mdSpace,
          collapseLg ? 'none' : lgSpace,
          xlSpace,
        ]}
        paddingTop={
          collapseXs || collapseSm || collapseMd || collapseLg
            ? [
                collapseXs ? xsSpace : 'none',
                collapseSm ? smSpace : 'none',
                collapseMd ? mdSpace : 'none',
                collapseLg ? lgSpace : 'none',
                'none',
              ]
            : undefined
        }
        height="full"
        {...collapsibleAlignmentChildProps}
        className={styles.columnContent}
      >
        {children}
      </Box>
    </Box>
  )
}
