import React from 'react'

import * as styles from './Page.treat'

interface PropTypes {
  children: React.ReactNode
}

function Page({ children }: PropTypes) {
  return <main className={styles.root}>{children}</main>
}

export default Page
