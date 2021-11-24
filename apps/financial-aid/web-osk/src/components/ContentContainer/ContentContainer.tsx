import React from 'react'
import * as styles from './ContentContainer.css'

interface Props {
  children: React.ReactNode
}

const ContentContainer = ({ children }: Props) => {
  return <div className={styles.formContainer}>{children}</div>
}

export default ContentContainer
