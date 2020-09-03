import React from 'react'
import Link from 'next/link'

import { Header as IslandUIHeader } from '@island.is/island-ui/core'

function Header() {
  return (
    <IslandUIHeader
      logoRender={(logo) => (
        <Link href="/">
          <a>{logo}</a>
        </Link>
      )}
    />
  )
}

export default Header
