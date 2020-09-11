/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import {
  Logo,
  Link,
  Columns,
  Column,
  Box,
  Button,
  Hidden,
  ResponsiveSpace,
  GridContainer,
  GridColumn,
  GridRow,
  ColorSchemeContext,
  FocusableBox,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import useRouteNames from '@island.is/web/i18n/useRouteNames'
import { SearchInput } from '../'
import { LanguageToggler } from '../LanguageToggler'
import { SideMenu } from '../SideMenu'
import { tempTabs } from '../../json'

interface HeaderProps {
  showSearchInHeader?: boolean
}

const marginLeft = [1, 1, 1, 2] as ResponsiveSpace

export const Header: FC<HeaderProps> = ({ showSearchInHeader = true }) => {
  const { activeLocale, t } = useI18n()
  const Router = useRouter()
  const { makePath } = useRouteNames(activeLocale)
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const { colorScheme } = useContext(ColorSchemeContext)

  const locale = activeLocale
  const english = activeLocale === 'en'
  const isWhite = colorScheme === 'white'

  return (
    <GridContainer>
      <GridRow>
        <GridColumn span="12/12" paddingTop={4} paddingBottom={4}>
          <Columns alignY="center" space={2}>
            <Column width="content">
              <FocusableBox href={english ? '/en' : '/'}>
                <Hidden above="md">
                  <Logo width={40} iconOnly solid={isWhite} />
                </Hidden>
                <Hidden below="lg">
                  <Logo width={160} solid={isWhite} />
                </Hidden>
              </FocusableBox>
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
                        id="search_input_header"
                        size="medium"
                        activeLocale={locale}
                        placeholder="Leitaðu á Ísland.is"
                        autocomplete={false}
                      />
                    </Hidden>
                    <Hidden above="md">
                      <Button
                        variant="menu"
                        icon="search"
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
                <Hidden below="md">
                  <FocusableBox
                    href="//minarsidur.island.is/"
                    marginLeft={marginLeft}
                  >
                    <Button variant="menu" leftIcon="user" tabIndex={-1}>
                      {t.login}
                    </Button>
                  </FocusableBox>
                </Hidden>
                <Box marginLeft={marginLeft}>
                  <LanguageToggler hideWhenMobile />
                </Box>
                <Box marginLeft={marginLeft} position="relative">
                  <Button
                    variant="menu"
                    onClick={() => setSideMenuOpen(true)}
                    icon="burger"
                  >
                    Valmynd
                  </Button>
                </Box>
              </Box>
            </Column>
          </Columns>
        </GridColumn>
      </GridRow>
      <SideMenu
        isVisible={sideMenuOpen}
        handleClose={() => setSideMenuOpen(false)}
        tabs={tempTabs}
      />
    </GridContainer>
  )
}

export default Header
