import React from 'react'

import styles from './index.module.scss'

interface PropTypes {
  children: React.ReactNode
}

function Page({ children }: PropTypes) {
  return <main className={styles.container}>{children}</main>
}

export default Page
