import React, { FC } from 'react'
import { Logo, Inline, ContentBlock, Box } from '@island.is/island-ui/core'
import Link from 'next/link'

export const Header: FC = () => {
  return (
    <ContentBlock width="large">
      <Box width="full" padding={[3, 3, 6]}>
        <Inline space="gutter" alignY="center">
          <Link href="/">
            {/* eslint-disable-next-line */}
            <a>
              <Logo />
            </a>
          </Link>
        </Inline>
      </Box>
    </ContentBlock>
  )
}

export default Header
