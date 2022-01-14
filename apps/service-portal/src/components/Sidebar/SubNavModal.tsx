import { Box } from '@island.is/island-ui/core'
import React from 'react'
import * as styles from './SubNavModal.css'
interface Props {
  active: boolean
  children: React.ReactNode
}

const SubNavModal = ({ active, children }: Props) => (
  <Box
    display="none"
    className={active ? styles.active : ''}
    justifyContent="flexEnd"
  >
    <Box
      background="blue100"
      paddingY={2}
      paddingX={3}
      className={styles.inner}
    >
      {children}
    </Box>
  </Box>
)

export default SubNavModal
