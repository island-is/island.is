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
  Icon,
  GridContainer,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import useRouteNames from '@island.is/web/i18n/useRouteNames'
import { SearchInput } from '../'
import { useRouter } from 'next/router'
import { Colors } from '@island.is/island-ui/theme'

interface HeaderProps {
  showSearchInHeader?: boolean
  white?: boolean
}

const LanguageToggler: FC<{
  hideWhenMobile?: boolean
  white?: boolean
}> = ({ hideWhenMobile, white }) => {
  const { activeLocale, locale, t } = useI18n()
  const otherLanguageUrl = activeLocale === 'en' ? '/' : '/en'
  const onClick = () => {
    locale(t.otherLanguageCode)
  }
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

  const LanguageButton = (
    <Link href={otherLanguageUrl}>
      <Button variant="menu" white={white} onClick={onClick}>
        {t.otherLanguageName}
      </Button>
    </Link>
  )

  return !hideWhenMobile ? (
    LanguageButton
  ) : (
    <Hidden below="md">{LanguageButton}</Hidden>
  )
}

const marginLeft = [1, 1, 1, 2] as ResponsiveSpace

export const Header: FC<HeaderProps> = ({
  showSearchInHeader = true,
  white = false,
}) => {
  const { activeLocale, t } = useI18n()
  const Router = useRouter()
  const { makePath } = useRouteNames(activeLocale)

  const locale = activeLocale
  const english = activeLocale === 'en'

  const logoColor: Colors = white ? 'white' : 'blue400'

  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={12} paddingTop={4} paddingBottom={4}>
          <Columns alignY="center" space={2}>
            <Column width="content">
              <Link href={english ? '/en' : '/'} passHref>
                {/* eslint-disable-next-line */}
                <a>
                  <Hidden above="md">
                    <Logo width={40} iconOnly />
                  </Hidden>
                  <Hidden below="lg">
                    <Logo width={160} solid solidColor={logoColor} />
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
                {showSearchInHeader && (
                  <>
                    <Hidden below="lg">
                      <SearchInput
                        size="medium"
                        activeLocale={locale}
                        placeholder="Leitaðu á Ísland.is"
                        autocomplete={false}
                        white={white}
                      />
                    </Hidden>
                    <Hidden above="md">
                      <Button
                        variant="menu"
                        icon="search"
                        white={white}
                        onClick={() => {
                          Router.push({
                            pathname: makePath('search'),
                            query: { focus: true },
                          })
                        }}
                      />
                    </Hidden>
                  </>
                )}
                <Box marginLeft={marginLeft}>
                  <Link href="https://minarsidur.island.is/" passHref>
                    <Button variant="menu" leftIcon="user" white={white}>
                      {t.login}
                    </Button>
                  </Link>
                </Box>
                <Box marginLeft={marginLeft}>
                  <LanguageToggler white={white} hideWhenMobile />
                </Box>
                <Box marginLeft={marginLeft}>
                  <Button variant="menu" white={white}>
                    <Icon type="logo" color={white ? 'white' : 'blue400'} />
                  </Button>
                </Box>
              </Box>
            </Column>
          </Columns>
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default Header
