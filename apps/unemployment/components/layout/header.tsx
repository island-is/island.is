import React, { useContext } from 'react'
import { Header as IslandUIHeader } from '@island.is/island-ui/core'
import { UserContext } from '../util/UserProvider'

function Header() {
  const { user, logOut } = useContext(UserContext)

  return (
    <IslandUIHeader
      logoRender={(logo) => <a href={'/'}>{logo}</a>}
      logoutText={'Útskrá'}
      userLogo={''}
      language={'IS'}
      switchLanguage={() => {
        return true
      }}
      userName={user?.name}
      authenticated={true}
      onLogout={logOut}
    />
  )
}

export default Header
