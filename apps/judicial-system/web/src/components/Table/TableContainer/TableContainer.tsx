import React from 'react'
import { TableSkeleton } from '@island.is/judicial-system-web/src/components/Table'

import * as styles from '../Table.css'

interface Props {
  tableHeader: React.ReactNode
  children: React.ReactNode
  loading: boolean
}

const TableContainer: React.FC<Props> = (props) => {
  const { loading, tableHeader, children } = props

  if (loading) {
    return <TableSkeleton />
  } else {
    return (
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>{tableHeader}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    )
  }
}

export default TableContainer
