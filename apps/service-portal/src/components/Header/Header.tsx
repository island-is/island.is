import React from 'react'
import { removeToken } from '../../auth/utils'
import { Link } from 'react-router-dom'
import { useStateValue } from './../../stateProvider'
import { initialState } from '../../store'
import { useHistory } from 'react-router-dom'
import { usePersistUserInfo } from '../../hooks/usePersistUserInfo/usePersistUserInfo'
import { MOCK_AUTH_KEY } from '@island.is/service-portal/constants'
import { Logo, Box, ContentBlock, Hidden } from '@island.is/island-ui/core'

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
      <Box width="full">
        <ContentBlock>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            width="full"
            padding={[3, 3, 6]}
          >
            <Link to="/">
              {/* eslint-disable-next-line */}
              <Hidden above="md">
                <Logo width={40} iconOnly />
              </Hidden>
              <Hidden below="lg">
                <Logo width={160} />
              </Hidden>
            </Link>
            <button style={{ marginLeft: 'auto' }} onClick={handleLogout}>
              Útskráning
            </button>
          </Box>
        </ContentBlock>
      </Box>
    </header>
  )
}

export default Header
