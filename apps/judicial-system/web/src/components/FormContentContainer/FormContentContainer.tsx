import React from 'react'

import { Box } from '@island.is/island-ui/core'

import * as styles from './FormContentContainer.css'

interface Props {
  isFooter?: boolean
}

const FormContentContainer: React.FC<React.PropsWithChildren<Props>> = (
  props,
) => {
  const renderContainer = () => (
    <Box paddingX={[3, 3, 3, 6, 14]}>{props.children}</Box>
  )

  return props.isFooter ? (
    <div className={styles.footerContainer}>{renderContainer()}</div>
  ) : (
    renderContainer()
  )
}

export default FormContentContainer
