import React from 'react'
import { GridColumn } from '@island.is/island-ui/core'
import * as styles from './FormContentContainer.css'

interface Props {
  isFooter?: boolean
}

const FormContentContainer: React.FC<Props> = (props) => {
  const renderContainer = () => (
    <GridColumn
      span={['9/9', '9/9', '7/9', '7/9']}
      offset={['0', '0', '1/9', '1/9']}
    >
      {props.children}
    </GridColumn>
  )

  return props.isFooter ? (
    <div className={styles.footerContainer}>{renderContainer()}</div>
  ) : (
    renderContainer()
  )
}

export default FormContentContainer
