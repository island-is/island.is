import React from 'react'
import * as styles from './ContentContainer.treat'

interface Props {
  children: React.ReactNode
}

const ContentContainer = ({ children }: Props) => {
  return <div className={styles.formContainer}>{children}</div>
}

export default ContentContainer
