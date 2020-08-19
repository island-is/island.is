import React, { FC, useEffect } from 'react'
import { useStore } from '../../store/stateProvider'

export const OidcSilentSignIn: FC = ({ children, ...rest }) => {
  const [{ userManager }, dispatch] = useStore()

  useEffect(() => {
    userManager
      .signinSilentCallback(window.location.href)
      .then(function(user) {
        console.log('return user: ', user)
        dispatch({
          type: 'setUserFulfilled',
          payload: user,
        })
      })
      .catch(function(error) {
        console.log(error)
      })
  }, [])
  return null
}

export default OidcSilentSignIn
