import React, { FC, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { Box, Typography } from '@island.is/island-ui/core'
import { Route, RouteProps } from 'react-router-dom'

export const ProtectedRoute: FC<RouteProps> = (props) => {
  const { userInfo, userInfoState, signInUser } = useAuth()

  useEffect(() => {
    if (
      (userInfo === null) &&
      userInfoState === 'passive'
    ) {
      signInUser()
    }
  }, [userInfo, userInfoState, signInUser])

  return <>
    {userInfo ? <Route {...props as RouteProps} />
    : (
      <Box display="flex" justifyContent="center" margin={12}>
        <Typography variant="h2">Augnablik</Typography>
      </Box>
      )
    }
    </>
}

export default ProtectedRoute
