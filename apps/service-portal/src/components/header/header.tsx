import React from 'react'
import { removeToken } from '../../auth/utils'
import { Link } from 'react-router-dom'
import { useStateValue } from './../../stateProvider'
import { initialState } from '../../store'
import { useHistory } from 'react-router-dom'
import { usePersistedState } from '../../hooks/usePersistedState/usePersistUserInfo'

const MOCK_AUTH_KEY = 'mockAuthenticated'

interface HeaderProps {
  something?: string
}

export const Header = (props: HeaderProps) => {
  const { userInfo, userInfoState } = usePersistedState()
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
