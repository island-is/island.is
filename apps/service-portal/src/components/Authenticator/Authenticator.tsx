import React, { FC } from 'react'
import { Route } from 'react-router-dom'
import { useStore } from '../../store/stateProvider'

export const Authenticator: FC = ({ children, ...rest }) => {
  const [{ userInfo, userManager }] = useStore()

  const isAuthenticated = !!userInfo
  console.log('Authenticator do authenticate ?', isAuthenticated)
  if(!isAuthenticated) {
    userManager.signinRedirect()
    console.log('is not authenticated')
    //userManager.signinSilent()
  }

  return (

    <Route
    {...rest}
    render={({ location }) =>
      isAuthenticated ? (
          children
      ) : (
        <h1>is not Logged in</h1>
      )
    }
  />
  )
}

export default Authenticator
