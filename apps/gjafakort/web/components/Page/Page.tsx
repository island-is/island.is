import React from 'react'
import { useStyles } from 'react-treat'

import * as styleRefs from './Page.treat'

interface PropTypes {
  children: React.ReactNode
}

function Page({ children }: PropTypes) {
  const styles = useStyles(styleRefs)

  return <main className={styles.root}>{children}</main>
}

export default Page
