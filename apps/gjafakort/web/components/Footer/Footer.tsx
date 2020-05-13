import React from 'react'
import { useStyles } from 'react-treat'

import * as styleRefs from './Footer.treat'

function Footer() {
  const styles = useStyles(styleRefs)

  return <footer className={styles.root}>I am a good footer</footer>
}

export default Footer
