import React from 'react'
import { removeToken } from '../../auth/utils'
import { Link } from 'react-router-dom'
import { useStateValue } from './../../stateProvider'
import { initialState } from '../../store'
import { useHistory } from 'react-router-dom'

export interface HeaderProps {
  something?: string
}

export const Header = (props: HeaderProps) => {
  const [, setState] = useStateValue()
  const history = useHistory()
  const handleLogout = async () => {
    await removeToken()
    setState(initialState)
    history.push('/innskraning')
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
