import React from 'react'
import { GridColumn } from '@island.is/island-ui/core'
import * as styles from './FormContentContainer.treat'

interface Props {
  children: React.ReactNode
}

const FormContentContainer = ({ children }: Props) => {
  return <div className={styles.formContainer}>{children}</div>
}

export default FormContentContainer
