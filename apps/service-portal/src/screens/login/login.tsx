import React from 'react'
import useUserInfo from '../../hooks/useUserInfo/useUserInfo'

export const Login = () => {
  const { setUser } = useUserInfo()

  const handleLogin = async () => {
    setUser()
  }

  return (
    <div>
      <button onClick={handleLogin}>Innskráning</button>
    </div>
  )
}
