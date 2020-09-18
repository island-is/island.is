import React, { FC } from 'react'
import { Header as UIHeader } from '@island.is/island-ui/core'
import { useAuthState } from '../context/AuthProvider'
import { useParams } from 'react-router-dom'

const Header: FC<{}> = () => {
  const [{ isAuthenticated, userInfo }] = useAuthState()
  const { lang } = useParams()

  return (
    <UIHeader
      authenticated={isAuthenticated}
      userName={userInfo?.profile?.name}
      language={lang || 'is'}
    />
  )
}

export default Header
