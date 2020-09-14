import React from 'react'

import * as styles from './Label.treat'

export const Label: React.FC<React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>> = ({ children, ...props }) => {
  return (
    <label {...props} className={styles.label}>
      {children}
    </label>
  )
}

export default Label
