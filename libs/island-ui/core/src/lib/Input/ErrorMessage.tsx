import React, { ReactNode } from 'react'
import * as styles from './Input.css'

interface Props {
  id?: string
  children: ReactNode
}

export const ErrorMessage = ({ id, children }: Props) => {
  return (
    <div
      id={id}
      className={styles.errorMessage}
      aria-live="assertive"
      data-testid="inputErrorMessage"
    >
      {children}
    </div>
  )
}
