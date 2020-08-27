import React, { FC } from 'react'

import * as styles from './Sticky.treat'

interface Props {
  top?: number
}

export const Sticky: FC<Props> = ({ children, top = 0 }) => {
  return (
    <div className={styles.sticky} style={{ top }}>
      {children}
    </div>
  )
}

export default Sticky
