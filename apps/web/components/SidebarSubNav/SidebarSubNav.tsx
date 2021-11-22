import React, { FC } from 'react'
import * as styles from './SidebarSubNav.css'

export const SidebarSubNav: FC = ({ children }) => {
  return <div className={styles.container}>{children}</div>
}
