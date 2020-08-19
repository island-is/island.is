import React, { FC, useEffect, useState } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuthenticated } from '../../auth/utils'
import { userNameContainer } from 'libs/island-ui/core/src/lib/Header/Header.treat'
import useUserInfo from '../../hooks/useUserInfo/useUserInfo'
import { useStore } from '../../store/stateProvider'

export const Authenticator: FC = ({ children, ...rest }) => {
  const [{ userInfo, userManager }] = useStore()

  return (
    <Route
      {...rest}
      render={({ location }) =>
        !userInfo ? userManager.signinRedirect() : children
      }
    />
  )
}

export default Authenticator
