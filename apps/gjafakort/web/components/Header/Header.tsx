import React from 'react'
import { useStyles } from 'react-treat'

import * as styleRefs from './Header.treat'

function Header() {
  const styles = useStyles(styleRefs)

  return <header className={styles.root}>I am a good header</header>
}

export default Header
