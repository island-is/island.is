import React, { FC } from 'react'

import * as styles from './Table.treat'
import { Typography } from '@island.is/island-ui/core'

interface Data {
  span?: number
}

export const Table: FC = ({ children }) => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>{children}</table>
    </div>
  )
}
export const Head: FC = ({ children }) => {
  return <thead className={styles.tHead}>{children}</thead>
}
export const Body: FC = ({ children }) => {
  return <tbody>{children}</tbody>
}
export const Row: FC = ({ children }) => {
  return <tr className={styles.tr}>{children}</tr>
}
export const Data: FC<Data> = ({ children, span = 1 }) => {
  return (
    <td className={styles.td} colSpan={span}>
      <Typography variant="p">{children}</Typography>
    </td>
  )
}
export const HeadData: FC<Data> = ({ children, span }) => {
  return (
    <Data span={span}>
      <strong>{children}</strong>
    </Data>
  )
}
