import React, { ReactNode, FC } from 'react'
import cn from 'classnames'

import { useBoxStyles, UseBoxStylesProps } from '../Box/useBoxStyles'
import { getTextStyles, TextProps } from '../Text/Text'
import * as styles from './Table.treat'

type DataField = Omit<UseBoxStylesProps, 'component'> & {
  children?: ReactNode
  text?: Pick<
    TextProps,
    'variant' | 'color' | 'truncate' | 'fontWeight' | 'lineHeight'
  >
}

type Table = Omit<UseBoxStylesProps, 'component'> & {
  children?: ReactNode
}

export const Table = ({ children, ...props }: Table) => {
  return (
    <div
      className={useBoxStyles({ component: 'div', overflow: 'auto', ...props })}
    >
      <table
        className={cn(
          useBoxStyles({
            component: 'table',
            overflow: 'hidden',
            width: 'full',
          }),
          styles.table,
        )}
      >
        {children}
      </table>
    </div>
  )
}
export const Head: FC = ({ children }) => {
  return <thead>{children}</thead>
}
export const Body: FC = ({ children }) => {
  return <tbody>{children}</tbody>
}
export const Foot: FC = ({ children }) => {
  return <tfoot>{children}</tfoot>
}
export const Row: FC = ({ children }) => {
  return <tr>{children}</tr>
}
export const Data = ({ children, text = {}, ...props }: DataField) => {
  const classNames = cn(
    styles.cell,
    getTextStyles({
      variant: 'small',
      ...text,
    }),
    useBoxStyles({
      component: 'td',
      paddingLeft: 3,
      paddingRight: 3,
      paddingTop: 'p5',
      paddingBottom: 'p5',
      borderBottomWidth: 'standard',
      borderColor: 'blue200',
      ...props,
    }),
  )
  return <td className={classNames}>{children}</td>
}
export const HeadData = ({ children, text = {}, ...props }: DataField) => {
  const classNames = cn(
    styles.cell,
    getTextStyles({
      variant: 'h5',
      ...text,
    }),
    useBoxStyles({
      component: 'th',
      paddingLeft: 3,
      paddingRight: 3,
      paddingTop: 'p2',
      paddingBottom: 'p2',
      borderBottomWidth: 'standard',
      borderColor: 'blue200',
      background: 'blue100',
      textAlign: 'left',
      ...props,
    }),
  )
  return <th className={classNames}>{children}</th>
}
