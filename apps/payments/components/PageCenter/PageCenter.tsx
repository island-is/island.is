import { ReactNode } from 'react'

import { Box } from '@island.is/island-ui/core'

import * as styles from './PageCenter.css'

type PageCenterProps = {
  children: ReactNode
  verticalCenter?: boolean
}

export const PageCenter = ({
  children,
  verticalCenter = true,
}: PageCenterProps) => (
  <Box
    display="flex"
    alignItems={verticalCenter ? 'center' : 'flexStart'}
    justifyContent="center"
    className={styles.container}
  >
    {children}
  </Box>
)
