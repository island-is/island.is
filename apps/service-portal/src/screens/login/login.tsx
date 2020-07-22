import React from 'react'
import useUserInfo from '../../hooks/useUserInfo/useUserInfo'
import { useHistory } from 'react-router-dom'

export const Login = () => {
  const history = useHistory()
  const historyState = history.location.state as { from?: string }
  const { setUser } = useUserInfo()

  const handleLogin = async () => {
    await setUser()
    history.push(historyState?.from || '/')
  }

  return (
    <div>
      <button onClick={handleLogin}>Innskráning</button>
    </div>
  )
}
