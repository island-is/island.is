import React, { FC, useEffect } from 'react'
import { useStore } from '../../store/stateProvider'
import { useHistory } from 'react-router-dom'

export const OidcSignIn: FC = () => {
  const [{ userManager }] = useStore()
  const history = useHistory()
  useEffect(() => {
    userManager
      .signinCallback(window.location.href)
      .then(function(user) {
        history.push('/')
      })
      .catch(function(error) {
        console.log(error)
      })
  }, [])

  return <p>redirctin logging in..</p>
}

export default OidcSignIn
