import React from 'react'
import { removeToken } from '../../auth/utils'
import { Link } from 'react-router-dom'
import { useStateValue } from './../../stateProvider'
import { initialState } from '../../store'
import { useHistory } from 'react-router-dom'
import { usePersistUserInfo } from '../../hooks/usePersistUserInfo/usePersistUserInfo'
import { MOCK_AUTH_KEY } from '@island.is/service-portal/constants'

interface HeaderProps {
  something?: string
}

export const Header = (props: HeaderProps) => {
  usePersistUserInfo()
  const [state, setState] = useStateValue()
  const history = useHistory()
  console.log(state)
  const handleLogout = async () => {
    await removeToken()
    setState(initialState)
    localStorage.removeItem(MOCK_AUTH_KEY)
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
