import React from 'react'
// import { useHistory, useLocation } from 'react-router-dom'
import { fetchToken } from './../../auth/utils'
import { useStore } from './../../stateProvider'
import jwtDecode from 'jwt-decode'
import { useHistory } from 'react-router-dom'

interface Subject {
  accountType: string
  email: string
  name: string
  nationalId: string
  phone: string
  scope: string[]
}

export const Login = () => {
  const [, dispatch] = useStore()
  const history = useHistory()

  const handleLogin = async () => {
    const userData = await fetchToken()
    dispatch({
      type: 'setUser',
      payload: jwtDecode(userData.token),
    })
    history.push('/')
  }

  return (
    <div>
      <button onClick={handleLogin}>Innskráning</button>
    </div>
  )
}
