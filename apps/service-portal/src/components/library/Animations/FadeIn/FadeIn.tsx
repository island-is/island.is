import React, { FC } from 'react'
import * as styles from './FadeIn.treat'

const FadeIn: FC<{}> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>
}

export default FadeIn
