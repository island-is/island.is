import React, { FC } from 'react'
import useAuth from '../../../hooks/useAuth/useAuth'
import * as styles from './UserInfoLoadingOverlay.treat'
import { Typography } from '@island.is/island-ui/core'

const UserInfoLoadingOverlay: FC<{}> = () => {
  const { userInfoState } = useAuth()

  if (userInfoState === 'pending')
    return (
      <div className={styles.overlay}>
        <Typography variant="h2">Skipti um notanda</Typography>
      </div>
    )
  return null
}

export default UserInfoLoadingOverlay
