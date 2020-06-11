import React, { FC } from 'react'
import {
  Logo,
  Columns,
  Column,
  ContentBlock,
  Inline,
  Box,
  Button,
  Select,
} from '@island.is/island-ui/core'
import Link from 'next/link'

import { selectOptions } from '../../json'

export const Header: FC = () => {
  return (
    <Box width="full">
      <ContentBlock>
        <Box width="full" padding={[3, 3, 6]}>
          <Columns alignY="center" space={2}>
            <Column width="content">
              <Link href="/">
                {/* eslint-disable-next-line */}
                <a>
                  <Logo />
                </a>
              </Link>
            </Column>
            <Column>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flexEnd"
                width="full"
              >
                <Inline space={2}>
                  <Button variant="menu">English</Button>
                  <Button variant="menu" leftIcon="user">
                    Innskráning
                  </Button>
                  <Select
                    placeholder="Leitaðu á Ísland.is"
                    options={selectOptions}
                    name="search"
                    icon="search"
                  />
                </Inline>
              </Box>
            </Column>
          </Columns>
        </Box>
      </ContentBlock>
    </Box>
  )
}

export default Header
