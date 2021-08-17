import React from 'react'
import { Header as IslandUIHeader } from '@island.is/island-ui/core'


function Header() {
  return (
    <IslandUIHeader
      logoRender={(logo) => <a href={'/'}>{logo}</a>}
      logoutText={'Útskrá'}
      userLogo={''}
      language={'IS'}
      switchLanguage={() => {
        return true
      }}
      userName={'Guðrún Jónsdóttir'}
      authenticated={true}
      onLogout={() => {
        return true
      }}
    />
  )
}

export default Header
