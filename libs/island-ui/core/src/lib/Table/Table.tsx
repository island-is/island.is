import React, { ReactNode, FC, AllHTMLAttributes } from 'react'
import cn from 'classnames'

import { useBoxStyles, UseBoxStylesProps } from '../Box/useBoxStyles'
import { getTextStyles, TextProps } from '../Text/Text'
import * as styles from './Table.treat'

type DataField = {
  children?: ReactNode
  text?: Pick<
    TextProps,
    'variant' | 'color' | 'truncate' | 'fontWeight' | 'lineHeight'
  >
  box?: Omit<UseBoxStylesProps, 'component'>
}

type Table = {
  children?: ReactNode
  box?: Omit<UseBoxStylesProps, 'component'>
}

export const Table = ({
  children,
  box,
  ...props
}: Table & Omit<AllHTMLAttributes<HTMLTableElement>, 'className'>) => {
  return (
    <div
      className={useBoxStyles({ component: 'div', overflow: 'auto', ...box })}
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
        {...props}
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
export const Data = ({
  children,
  text = {},
  box = {},
  ...props
}: DataField &
  Omit<AllHTMLAttributes<HTMLTableDataCellElement>, 'className'>) => {
  const classNames = cn(
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
      ...box,
    }),
    styles.cell,

  )
  return (
    <td className={classNames} {...props}>
      {children}
    </td>
  )
}
export const HeadData = ({
  children,
  text = {},
  box = {},
  ...props
}: DataField &
  Omit<AllHTMLAttributes<HTMLTableHeaderCellElement>, 'className'>) => {
  const classNames = cn(
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
      ...box,
    }),
    styles.cell,

  )
  return (
    <th className={classNames} {...props}>
      {children}
    </th>
  )
}
