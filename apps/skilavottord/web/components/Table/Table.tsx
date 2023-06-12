import React, { FC } from 'react'
import * as styles from './Table.css'
import cn from 'classnames'
import { Text } from '@island.is/island-ui/core'

interface Data {
  span?: number
  alignRight?: boolean
  textVariant?: TextVariants
}

export type TextVariants =
  | 'default'
  | 'small'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'intro'
  | 'eyebrow'

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
  textVariant = 'default',
}) => {
  return (
    <td
      className={cn(styles.td, { [styles.alignRight]: alignRight })}
      colSpan={span}
    >
      <Text variant={textVariant}>{children}</Text>
    </td>
  )
}

export const HeadData: FC<React.PropsWithChildren<Data>> = ({
  children,
  span,
  alignRight,
  textVariant = 'default',
}) => {
  return (
    <td
      className={cn(styles.tdHead, { [styles.alignRight]: alignRight })}
      colSpan={span}
    >
      <div className={cn(styles.block)}>
        <Text variant={textVariant}>{children}</Text>
      </div>
    </td>
  )
}
