import React, { FC } from 'react'

import * as styles from './List.css'

export const List: FC<React.PropsWithChildren<{ type?: 'ul' | 'ol' }>> = ({
  children,
  type = 'ul',
}) => {
  return <ol className={type === 'ol' ? styles.ol : styles.ul}>{children}</ol>
}
export const ListItem: FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return <li className={styles.li}>{children}</li>
}
