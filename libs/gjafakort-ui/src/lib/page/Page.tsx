import React from 'react'

import styles from './Page.scss'

export const Page: React.FC = ({ children }) => (
  <main className={styles.container}>{children}</main>
)

export default Page
