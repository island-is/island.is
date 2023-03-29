import * as styles from './Label.css'

import { LabelHTMLAttributes, forwardRef } from 'react'

import cn from 'classnames'

export interface LableProps extends LabelHTMLAttributes<HTMLLabelElement> {
  hasError?: boolean
}

export const Label = forwardRef<HTMLLabelElement, LableProps>(
  ({ hasError, color, children, ...props }) => {
    return (
      <label
        {...props}
        className={cn(styles.label, {
          [styles.hasError]: hasError,
        })}
      >
        {children}
      </label>
    )
  },
)

