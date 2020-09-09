import React, { FC } from 'react'
import cn from 'classnames'
import { Box } from '../../Box'
import * as styles from './GridContainer.treat'

interface Props {
  className?: string
  id?: string
}

export const GridContainer: FC<Props> = ({ children, className, id }) => {
  return (
    <Box className={cn(className, styles.root)} id={id}>
      {children}
    </Box>
  )
}
