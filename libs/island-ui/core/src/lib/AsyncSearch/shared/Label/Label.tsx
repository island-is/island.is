import React from 'react'

import * as styles from './Label.treat'

export const Label = ({ children, ...props }) => {
  return (
    <label {...props} className={styles.label}>
      {children}
    </label>
  )
}

export default Label
