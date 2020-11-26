import React, { FC } from 'react'
import useAuth from '../../../hooks/useAuth/useAuth'
import * as styles from './UserInfoLoadingOverlay.treat'
import { Text } from '@island.is/island-ui/core'

const UserInfoLoadingOverlay: FC<{}> = () => {
  const { userInfoState } = useAuth()

  if (userInfoState === 'pending')
    return (
      <div className={styles.overlay}>
        <Text variant="h2">Skipti um notanda</Text>
      </div>
    )
  else if (userInfoState === 'logging-out')
    return (
      <div className={styles.overlay}>
        <Text variant="h2">Skrái notanda út</Text>
      </div>
    )
  return null
}

export default UserInfoLoadingOverlay
