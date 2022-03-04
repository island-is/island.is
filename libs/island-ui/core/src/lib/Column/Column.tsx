/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactNode, useContext } from 'react'
import { Box } from '../Box/Box'
import { ColumnsContext } from '../Columns/Columns'
import * as styles from './Column.css'

export interface ColumnProps {
  children: ReactNode
  width?: keyof typeof styles.width | 'content'
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

  return (
    <Box
      minWidth={0}
      width={width !== 'content' ? 'full' : undefined}
      flexShrink={width === 'content' ? 0 : undefined}
      className={[
        styles.column,
        width !== 'content' ? styles.width[width!] : null,
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
