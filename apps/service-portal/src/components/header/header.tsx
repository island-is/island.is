import React from 'react'
import { removeToken } from '../../auth/utils'
import { Link } from 'react-router-dom'
import { useStateValue } from './../../stateProvider'
import { initialState } from '../../store'

export interface HeaderProps {
  something?: string
}

export const Header = (props: HeaderProps) => {
  const [, setState] = useStateValue()
  const handleLogout = async () => {
    console.log('logout')
    await removeToken()
    setState(initialState)
    window.location.replace('/innskraning')
  }

  return (
    <header>
      <div>
        <Link to="/">Home</Link>
        <button onClick={handleLogout}>Útskráning</button>
      </div>
    </header>
  )
}

export default Header
