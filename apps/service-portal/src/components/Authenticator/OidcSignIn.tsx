import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import { UserManager } from 'oidc-client'
import { useStore } from '../../store/stateProvider'

export interface OidcSignInProps  {
  userManager?: UserManager
}

export const OidcSignIn: FC<OidcSignInProps> = ({
  userManager,
  children,
  ...rest
}) => {
  const [{ userInfo, userInfoState }, dispatch] = useStore()
  const history = useHistory()

  console.log('userinfo', userInfo)
  const user = userManager.signinCallback(window.location.href).then(function(user) {
    console.log(user)
    dispatch({
      type: 'setUserFulfilled',
      payload: user,
    })
    history.push('/')
  }).catch(function(error) {
    console.log(error)
  });


  return (
    <h1>Callback</h1>
  )
}

export default OidcSignIn
