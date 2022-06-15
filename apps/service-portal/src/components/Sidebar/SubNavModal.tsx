import { Box } from '@island.is/island-ui/core'
import React from 'react'
import * as styles from './NavItem/NavItem.css'
interface Props {
  children: React.ReactNode
}

const SubNavModal = ({ children }: Props) => (
  <Box display="none" justifyContent="flexEnd" id="sub-nav-model">
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
