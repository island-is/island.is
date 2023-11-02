import React, { FC } from 'react'
import cs from 'classnames'

import { Typography } from '@island.is/island-ui/core'
import * as styles from './Table.css'

interface Data {
  span?: number
  alignRight?: boolean
}

export const Table: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>{children}</table>
    </div>
  )
}
export const Head: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return <thead className={styles.tHead}>{children}</thead>
}
export const Body: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return <tbody>{children}</tbody>
}
export const Row: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return <tr className={styles.tr}>{children}</tr>
}
export const Data: FC<React.PropsWithChildren<Data>> = ({
  children,
  span = 1,
  alignRight,
}) => {
  return (
    <td
      className={cs(styles.td, { [styles.alignRight]: alignRight })}
      colSpan={span}
    >
      <Typography variant="p">{children}</Typography>
    </td>
  )
}
export const HeadData: FC<React.PropsWithChildren<Data>> = ({
  children,
  span,
  alignRight,
}) => {
  return (
    <Data span={span}>
      <strong className={cs(styles.block, { [styles.alignRight]: alignRight })}>
        {children}
      </strong>
    </Data>
  )
}
