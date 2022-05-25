import React from 'react'
import {
  Box,
  GridContainer as CoreGridContainer,
  GridContainerProps as CoreGridContainerProps,
} from '@island.is/island-ui/core'
import * as styles from './GridContainer.css'

export const GridContainer: React.FC<CoreGridContainerProps> = ({
  children,
  ...props
}) => {
  return (
    <Box className={styles.container}>
      <CoreGridContainer {...props}>{children}</CoreGridContainer>
    </Box>
  )
}

export default GridContainer
