import React, { FC } from 'react'
import { Box } from '../Box'
import * as styles from './Grid.treat'

export const Grid: FC = ({ children }) => {
  return <Box className={styles.grid}>{children}</Box>
}
