import React, { FC } from 'react'

import * as styles from './Sticky.treat'

export const Sticky: FC = ({ children }) => {
  return <div className={styles.sticky}>{children}</div>
}

export default Sticky
