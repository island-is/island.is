import React, { FC } from 'react'

import { Box } from '../../Box/Box'
import * as styles from './SectionNumberColumn.treat'

interface SectionNumberColumnProps {
  children?: React.ReactNode
  className?: string
}

export const SectionNumberColumn: FC<SectionNumberColumnProps> = ({
  children,
  className,
}) => (
  <Box
    position="relative"
    display="flex"
    alignItems="center"
    justifyContent="center"
    marginRight={[1, 1, 2]}
    className={[styles.root, className]}
  >
    {children}
  </Box>
)
