import React from 'react'

import * as styles from './SkipToMainContent.css'

type Props = {
  title?: string
}

export const SkipToMainContent = ({ title = 'Fara beint í efnið' }: Props) => {
  return (
    <a className={styles.container} href="#main-content">
      {title}
    </a>
  )
}

export default SkipToMainContent
