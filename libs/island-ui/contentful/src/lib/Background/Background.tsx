import React, { FC } from 'react'
import cn from 'classnames'
import { Box, BoxProps } from '@island.is/island-ui/core'
import * as styles from './Background.css'

export const Background: FC<React.PropsWithChildren<BoxProps>> = ({
  children,
  ...props
}) => {
  return (
    <Box {...props} className={cn(styles.container, props.className)}>
      <div className={styles.inner}>{children}</div>
    </Box>
  )
}

export default Background
