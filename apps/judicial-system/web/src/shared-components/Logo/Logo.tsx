import React, { useContext } from 'react'
import { Box } from '@island.is/island-ui/core'
import { UserContext } from '../UserProvider/UserProvider'
import LandWightsLogo from './LandWightsLogo'

import * as styles from './Logo.css'

const Logo: React.FC = () => {
  const { user } = useContext(UserContext)

  return (
    <div className={styles.logoContainer}>
      <Box marginRight={2}>
        <LandWightsLogo />
      </Box>
      <p className={styles.logoText}>{user?.institution?.name ?? ''}</p>
    </div>
  )
}

export default Logo
