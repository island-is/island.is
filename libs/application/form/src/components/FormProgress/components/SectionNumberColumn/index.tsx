import React, { FC } from 'react'
import { Box } from '@island.is/island-ui/core'

import * as styles from './SectionNumberColumn.treat'

const SectionNumberColumn: FC<{ children?: React.ReactNode }> = ({
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

export default SectionNumberColumn
