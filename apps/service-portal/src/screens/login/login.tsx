import React from 'react'
// import { useHistory, useLocation } from 'react-router-dom'
import { fetchToken } from './../../auth/utils'
import { useStore } from './../../stateProvider'
import jwtDecode from 'jwt-decode'
import { useHistory } from 'react-router-dom'
import { MockUserData } from '../../store'

interface Subject {
  accountType: string
  email: string
  name: string
  nationalId: string
  phone: string
  scope: string[]
}

interface DecodedJwtToken {
  user: MockUserData
  availableSubjects: Subject[]
  id: number
  nationalId: string
}

export const Login = () => {
  const [, dispatch] = useStore()
  const history = useHistory()

  const handleLogin = async () => {
    const userData = await fetchToken()
    const Token = userData.token
    const decodedToken: DecodedJwtToken = jwtDecode(Token)
    dispatch({
      type: 'setUser',
      payload: decodedToken.user,
    })
    history.push('/')
  }

  return (
    <div>
      <button onClick={handleLogin}>Innskráning</button>
    </div>
  )
}
