import React, { FC } from 'react'
import { useStore } from '../../store/stateProvider'

export const OidcSilentSignIn: FC = ({ children, ...rest }) => {
  const [{ userManager }, dispatch] = useStore()

  userManager
    .signinSilentCallback()
    .then(function(user) {
      console.log(user)
      dispatch({
        type: 'setUserFulfilled',
        payload: user,
      })
    })
    .catch(function(error) {
      console.log(error)
    })

  return <p>redirect</p>
}

export default OidcSilentSignIn
