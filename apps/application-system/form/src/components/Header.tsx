import React, { FC } from 'react'
import { Header as UIHeader } from '@island.is/island-ui/core'
import { useAuthState } from '../context/AuthProvider'

const Header: FC<{}> = () => {
  const [{ isAuthenticated, userInfo }] = useAuthState()

  return (
    <UIHeader
      authenticated={isAuthenticated}
      userName={userInfo?.profile?.name}
    />
  )
}

export default Header
