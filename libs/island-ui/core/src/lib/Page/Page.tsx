import React from 'react'

import * as styles from './Page.treat'
import { Box, BoxProps } from '../..'

interface PageProps {
  component?: BoxProps['component']
}

export const Page: React.FC<PageProps> = ({ component = 'main', children }) => (
  <Box className={styles.container} component={component}>
    {children}
  </Box>
)
