import React, { FC } from 'react'
import { removeToken } from '../../auth/utils'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { usePersistUserInfo } from '../../hooks/usePersistUserInfo/usePersistUserInfo'
import { MOCK_AUTH_KEY } from '@island.is/service-portal/constants'
import {
  Logo,
  Box,
  ContentBlock,
  Hidden,
  Columns,
  Column,
} from '@island.is/island-ui/core'
import SubjectSwitcher from './SubjectSwitcher/SubjectSwitcher'

export const Header: FC<{}> = () => {
  usePersistUserInfo()
  const history = useHistory()

  const handleLogout = async () => {
    await removeToken()
    // TODO: Remove store state?
    localStorage.removeItem(MOCK_AUTH_KEY)
    history.push('/innskraning')
  }

  return (
    <header>
      <Box width="full" padding={[3, 3, 6]}>
        <ContentBlock>
          <Columns>
            <Column width="8/12">
              <Link to="/">
                {/* eslint-disable-next-line */}
                <Hidden above="md">
                  <Logo width={40} iconOnly />
                </Hidden>
                <Hidden below="lg">
                  <Logo width={160} />
                </Hidden>
              </Link>
            </Column>
            <Column width="3/12">
              <SubjectSwitcher />
            </Column>
            <Column width="1/12">
              <Box
                display="flex"
                height="full"
                alignItems="center"
                marginLeft={1}
              >
                <button onClick={handleLogout}>Útskráning</button>
              </Box>
            </Column>
          </Columns>
        </ContentBlock>
      </Box>
    </header>
  )
}

export default Header
