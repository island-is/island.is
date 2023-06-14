import React from 'react'

import * as styles from '../Table.css'

interface Props {
  tableHeader: React.ReactNode
  children: React.ReactNode
}

const TableContainer: React.FC<Props> = (props) => {
  const { tableHeader, children } = props

  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr>{tableHeader}</tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  )
}

export default TableContainer
