import { Box } from '@island.is/island-ui/core'
import React, { FC } from 'react'
import { useStore } from '../../store/stateProvider'
import * as styles from './MobileMenu.treat'

const MobileMenu: FC<{}> = () => {
  const [{ mobileMenuState }] = useStore()

  if (mobileMenuState === 'closed') return null
  return (
    <Box
      position="fixed"
      right={0}
      bottom={0}
      left={0}
      background="blueberry100"
      className={styles.wrapper}
    >
      MobileMenu
    </Box>
  )
}

export default MobileMenu
