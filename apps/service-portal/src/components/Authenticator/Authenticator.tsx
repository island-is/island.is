import React, { FC, useEffect } from 'react'
import { Route } from 'react-router-dom'
import { useStore } from '../../store/stateProvider'
import useUserInfo from '../../hooks/useUserInfo/useUserInfo'

export const Authenticator: FC = ({ children, ...rest }) => {
  const [{ userInfo, userManager }, dispatch] = useStore()
  const isAuthenticated = !!userInfo

  useEffect(() => {
    async function refresh() {
      dispatch({
        type: 'setUserPending',
      })

      try {
        const user = await userManager.signinSilent()
        dispatch({
          type: 'setUserFulfilled',
          payload: user,
        })
      } catch (exception) {
        console.log(exception)
        userManager.signinRedirect()
      }
    }
    refresh()
  }, [])

  return (
    <Route
      {...rest}
      render={({ location }) => (userInfo ? children : <h2>loading..</h2>)}
    />
  )
}

export default Authenticator
