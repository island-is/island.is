import React from 'react'
import styles from './Page.module.css'

export const Page = ({ children }) => (
  <main className={styles.container}>{children}</main>
)
