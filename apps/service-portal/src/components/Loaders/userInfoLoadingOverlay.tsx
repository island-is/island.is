import React, { FC } from 'react'
import useUserInfo from '../../hooks/useUserInfo/useUserInfo'
import * as styles from './userInfoLoadingOverlay.treat'
import { Typography } from '@island.is/island-ui/core'

const UserInfoLoadingOverlay: FC<{}> = () => {
  const { userInfoState } = useUserInfo()

  if (userInfoState === 'pending')
    return (
      <div className={styles.overlay}>
        <Typography variant="h2">Skipti um notanda</Typography>
      </div>
    )
  return null
}

export default UserInfoLoadingOverlay
