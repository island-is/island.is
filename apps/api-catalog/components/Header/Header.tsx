import React from 'react'
import { Link } from '@island.is/island-ui/core'

import { Header as IslandUIHeader } from '@island.is/island-ui/core'

function Header() {
  return (
    <IslandUIHeader
      logoRender={(logo) => (
        <Link href="/">
          {logo}
        </Link>
      )}
    />
  )
}

export default Header
