import React, { FC, useEffect } from 'react'
import { Route } from 'react-router-dom'
import { useStore } from '../../store/stateProvider'

export const Authenticator: FC = ({ children, ...rest }) => {
  const [{ userInfo, userManager }, dispatch] = useStore()

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
