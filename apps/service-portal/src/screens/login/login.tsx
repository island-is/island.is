import React from 'react'
// import { useHistory, useLocation } from 'react-router-dom'
import { fetchToken } from './../../auth/utils'
import { useStateValue } from './../../stateProvider'
import jwtDecode from 'jwt-decode'
import { useHistory } from 'react-router-dom'

const MOCK_AUTH_KEY = 'mockAuthenticated'

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
  const history = useHistory()
  const handleLogin = async () => {
    const userData = await fetchToken()
    const Token = userData.token
    const decodedToken: DecodedJwtToken = jwtDecode(Token)
    dispatch({
      type: 'setUser',
      payload: decodedToken.user,
    })
    localStorage[MOCK_AUTH_KEY] = Token
    history.push('/')
  }
  return (
    <div>
      <button onClick={handleLogin}>Innskráning</button>
    </div>
  )
}
