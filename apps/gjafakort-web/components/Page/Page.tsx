import React from 'react'
import styles from './Page.module.scss'

export const Page = ({ children }) => (
  <main className={styles.container}>{children}</main>
)
