import React, { FC } from 'react'

import { Box } from '../../../Box/Box'
import * as styles from './SectionNumberColumn.treat'

export const SectionNumberColumn: FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <Box
    position="relative"
    display="flex"
    alignItems="center"
    justifyContent="center"
    marginRight={2}
    className={styles.root}
  >
    {children}
  </Box>
)
