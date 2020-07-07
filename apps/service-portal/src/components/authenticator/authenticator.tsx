import React, { FC } from 'react'
import { Route, Redirect } from 'react-router-dom'
import { isAuthenticated } from '../../auth/utils'

export interface AuthenticatorProps {
  something?: string
}

export const Authenticator: FC<AuthenticatorProps> = ({
  children,
  ...rest
}) => (
  <Route
    {...rest}
    render={({ location }) =>
      isAuthenticated() ? (
        children
      ) : (
        <Redirect
          to={{ pathname: '/innskraning', state: { from: location } }}
        />
      )
    }
  />
)

export default Authenticator
