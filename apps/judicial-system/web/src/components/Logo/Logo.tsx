import React, { useContext } from 'react'
import { Box } from '@island.is/island-ui/core'
import { UserContext } from '../UserProvider/UserProvider'
import LandWightsLogo from './LandWightsLogo'

import * as styles from './Logo.css'

interface Props {
  defaultInstitution?: string
}

const Logo: React.FC<Props> = ({ defaultInstitution }) => {
  const { user } = useContext(UserContext)

  return (
    <div className={styles.logoContainer}>
      <Box marginRight={2}>
        <LandWightsLogo />
      </Box>
      <p className={styles.logoText}>
        {user?.institution?.name ?? defaultInstitution ?? ''}
      </p>
    </div>
  )
}

export default Logo
