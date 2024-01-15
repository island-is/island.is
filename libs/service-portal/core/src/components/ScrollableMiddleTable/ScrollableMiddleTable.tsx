import { Box, Table as T } from '@island.is/island-ui/core'
import { amountFormat } from '../../utils/amountFormat'

import * as styles from './ScrollableMiddleTable.css'

export interface ScrollableMiddleTableProps {
  firstColumnData: React.ReactNode
  lastColumnData: React.ReactNode
  children: React.ReactNode
}

export const ScrollableMiddleTable = ({
  firstColumnData,
  lastColumnData,
  children,
}: ScrollableMiddleTableProps) => {
  return (
    <T.Table>
      <Box className={styles.fixedColumns}>{firstColumnData}</Box>
      <T.Body>{children}</T.Body>
      <Box className={styles.fixedColumns}>{lastColumnData}</Box>
    </T.Table>
  )
}
