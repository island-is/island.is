import React, { FC } from 'react'
import Link from 'next/link'
import {
  Logo,
  Columns,
  Column,
  ContentBlock,
  Inline,
  Box,
  Button,
  Hidden,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/web/i18n/I18n'
import { useI18n } from '@island.is/web/i18n'
import { SearchInput } from '../'

interface HeaderProps {
  showSearchInHeader?: boolean
}

const LanguageToggler: FC<{
  activeLocale?: Locale
  hideWhenMobile?: boolean
}> = ({ activeLocale, hideWhenMobile }) => {
  const languageButtonText =
    activeLocale === 'is' ? (
      <span>
        <Hidden above="md">EN</Hidden>
        <Hidden below="lg">English</Hidden>
      </span>
    ) : (
      <span>
        <Hidden above="md">IS</Hidden>
        <Hidden below="lg">Íslenska</Hidden>
      </span>
    )

  const languageButtonLink = activeLocale === 'en' ? '/' : '/en'

  const LanguageButton = (
    <Link href={languageButtonLink}>
      <Button variant="menu">{languageButtonText}</Button>
    </Link>
  )

  return !hideWhenMobile ? (
    LanguageButton
  ) : (
    <Hidden below="md">{LanguageButton}</Hidden>
  )
}

export const Header: FC<HeaderProps> = ({ showSearchInHeader = true }) => {
  const { activeLocale } = useI18n()

  const locale = activeLocale as Locale
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
                  <Hidden above="md">
                    <Logo width={40} iconOnly />
                  </Hidden>
                  <Hidden below="lg">
                    <Logo width={160} />
                  </Hidden>
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
                  <LanguageToggler hideWhenMobile activeLocale={locale} />
                  <Link href="https://minarsidur.island.is/" passHref>
                    <Button variant="menu" leftIcon="user">
                      Innskráning
                    </Button>
                  </Link>
                  {showSearchInHeader && (
                    <SearchInput
                      size="medium"
                      activeLocale={locale}
                      autocomplete={false}
                    />
                  )}
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
