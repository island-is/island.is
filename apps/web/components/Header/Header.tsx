import React, { FC } from 'react'
import {
  Logo,
  Columns,
  Column,
  ContentBlock,
  Inline,
  Box,
  Button,
  // Select,
} from '@island.is/island-ui/core'
import Link from 'next/link'

// import { selectOptions } from '../../json'
import { useI18n } from '@island.is/web/i18n'

export const Header: FC = () => {
  const { activeLocale } = useI18n()

  const languageButtonText = activeLocale === 'is' ? 'English' : 'Íslenska'
  const languageButtonLink = activeLocale === 'en' ? '/' : '/en'

  const english = activeLocale === 'en'

  return (
    <Box width="full">
      <ContentBlock>
        <Box width="full" padding={[3, 3, 6]}>
          <Columns alignY="center" space={2}>
            <Column width="content">
              <Link href={english ? '/en' : '/'}>
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
                  <Link href={languageButtonLink}>
                    <Button variant="menu">{languageButtonText}</Button>
                  </Link>

                  <Button variant="menu" leftIcon="user">
                    Innskráning
                  </Button>
                  {/* <Select
                    placeholder="Leitaðu á Ísland.is"
                    options={selectOptions}
                    name="search"
                    icon="search"
                  /> */}
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
