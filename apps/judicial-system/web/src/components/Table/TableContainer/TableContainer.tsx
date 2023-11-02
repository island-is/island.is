import React from 'react'

import { TableSkeleton } from '@island.is/judicial-system-web/src/components/Table'

import * as styles from '../Table.css'

interface Props {
  tableHeader: React.ReactNode
  children: React.ReactNode
  loading: boolean
  testid?: string
}

const TableContainer: React.FC<Props> = (props) => {
  const { loading, tableHeader, children, testid } = props

  if (loading) {
    return <TableSkeleton />
  } else {
    return (
      <table className={styles.table} data-testid={testid}>
        <thead className={styles.thead}>
          <tr>{tableHeader}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    )
  }
}

export default TableContainer
