import React, { FC } from 'react'
import cn from 'classnames'
import { Box, BoxProps } from '@island.is/island-ui/core'
import * as styles from './Background.treat'

export const Background: FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box {...props} className={cn(styles.container, props.className)}>
      <div className={styles.inner}>{children}</div>
    </Box>
  )
}

export default Background
