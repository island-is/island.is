import React from 'react'

import { Box } from '../../lib/Box/Box'
import { BoxProps } from '../../lib/Box/types'

import * as styles from './Page.css'

interface PageProps {
  component?: BoxProps['component']
}

export const Page: React.FC<PageProps> = ({ component = 'main', children }) => (
  <Box className={styles.container} component={component}>
    {children}
  </Box>
)
