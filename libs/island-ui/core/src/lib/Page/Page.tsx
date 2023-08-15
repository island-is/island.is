import React, { ReactNode } from 'react'

import * as styles from './Page.css'
import { Box } from '../../lib/Box/Box'
import { BoxProps } from '../../lib/Box/types'

interface PageProps {
  children?: ReactNode
  component?: BoxProps['component']
}

export const Page: React.FC<PageProps> = ({ component = 'main', children }) => (
  <Box className={styles.container} component={component}>
    {children}
  </Box>
)
