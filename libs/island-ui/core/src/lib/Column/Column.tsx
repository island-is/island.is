/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactNode, useContext } from 'react'
import { Box } from '../Box/Box'
import { ColumnsContext } from '../Columns/Columns'
import * as styles from './Column.treat'
import {
  resolveResponsiveProp,
  ResponsiveProp,
} from '../../utils/responsiveProp'

export interface ColumnProps {
  children: ReactNode
  width?: ResponsiveProp<keyof typeof styles.columnsWidths>
}

/** Standard columns */
export const Column = ({ children, width = '6/12' }: ColumnProps) => {
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

  return (
    <Box
      minWidth={0}
      width={!width ? 'full' : undefined}
      flexShrink={!width ? 0 : undefined}
      className={[
        styles.column,
        resolveResponsiveProp(
          width,
          styles.columnsXs,
          styles.columnsSm,
          styles.columnsMd,
          styles.columnsLg,
          styles.columnsXl,
        ),
      ]}
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
