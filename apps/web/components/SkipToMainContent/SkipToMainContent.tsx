import React, { FC } from 'react'

import * as styles from './SkipToMainContent.treat'

export const SkipToMainContent: FC = () => {
  return (
    <a className={styles.container} href="#main-content">
      Fara beint í efnið
    </a>
  )
}

export default SkipToMainContent
