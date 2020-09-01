/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import Link from 'next/link'
import {
  Logo,
  Columns,
  Column,
  ContentBlock,
  Box,
  Button,
  Hidden,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/adgerdir/i18n/I18n'
import { useI18n } from '@island.is/adgerdir/i18n'
import useRouteNames from '@island.is/adgerdir/i18n/useRouteNames'
import { useRouter } from 'next/router'

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

const marginLeft = [1, 1, 1, 2] as ResponsiveSpace

export const Header: FC<HeaderProps> = ({ showSearchInHeader = true }) => {
  const { activeLocale } = useI18n()
  const Router = useRouter()
  const { makePath } = useRouteNames(activeLocale as Locale)

  const locale = activeLocale as Locale
  const english = activeLocale === 'en'

  return (
    <Box width="full">
      <ContentBlock>
        <Box width="full" padding={[3, 3, 6]}>
          <Columns alignY="center" space={2}>
            <Column width="content">
              <Link href={english ? '/en' : '/'} passHref>
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
                <LanguageToggler hideWhenMobile activeLocale={locale} />
                <Box marginLeft={marginLeft}>
                  <Button
                    href="http://minarsidur.island.is/"
                    variant="menu"
                    leftIcon="user"
                  >
                    Innskráning
                  </Button>
                </Box>
              </Box>
            </Column>
          </Columns>
        </Box>
      </ContentBlock>
    </Box>
  )
}

export default Header
