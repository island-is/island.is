import React, { useContext } from 'react'
import { Box } from '@island.is/island-ui/core'
import { UserContext } from '../UserProvider/UserProvider'
import LandWightsLogo from './LandWightsLogo'

import * as styles from './Logo.css'

interface Props {
  defaultInstitution?: string
}

const Logo: React.FC<Props> = ({ defaultInstitution = '' }) => {
  const { user } = useContext(UserContext)
  const institutionName = user?.institution?.name ?? defaultInstitution
  const institutionNameArr = institutionName.split(' ')
  const institutionNameFirstHalf = institutionNameArr.slice(
    0,
    institutionNameArr.length - 1,
  )

  return (
    <div className={styles.logoContainer}>
      <Box marginRight={[0, 0, 0, 2]} marginBottom={[0, 0, 1, 0]}>
        <LandWightsLogo />
      </Box>
      <p className={styles.logoText}>
        <span>{institutionNameFirstHalf.toString().replace(',', ' ')}</span>
        <span>{institutionNameArr[institutionNameArr.length - 1]}</span>
      </p>
    </div>
  )
}

export default Logo
