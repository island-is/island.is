import React, { FC } from 'react'

import * as styles from './SkipToMainContent.treat'

export const SkipToMainContent: FC<{
  title?: string
}> = ({ title = 'Fara beint í efnið' }) => {
  return (
    <a className={styles.container} href="#main-content">
      {title}
    </a>
  )
}

export default SkipToMainContent
