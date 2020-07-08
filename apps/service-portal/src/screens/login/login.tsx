import React from 'react'
// import { useHistory, useLocation } from 'react-router-dom'
import { fetchToken } from './../../auth/utils'
import { useStateValue } from './../../stateProvider'
import jwtDecode from 'jwt-decode'
import {} from 'react-router-dom'

interface Subject {
  accountType: string
  email: string
  name: string
  nationalId: string
  phone: string
  scope: string[]
}

interface DecodedJwtToken {
  user: string
  availableSubjects: Subject[]
  id: number
  nationalId: string
}

export const Login = () => {
  const [, dispatch] = useStateValue()
  const handleLogin = async () => {
    const userData = await fetchToken()
    const decodedToken: DecodedJwtToken = jwtDecode(userData.token)
    dispatch({
      type: 'setUser',
      payload: decodedToken.user,
    })
    window.location.replace('/')
  }
  return (
    <div>
      <div>
        <button onClick={handleLogin}>Innskráning</button>
      </div>
    </div>
  )
}
