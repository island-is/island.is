/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState, useContext } from 'react'
import {
  Logo,
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
  ButtonTypes,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import { FixedNav, SkipToMainContent } from '@island.is/web/components'
import { SearchInput } from '../'
import { LanguageToggler } from '../LanguageToggler'
import ComboButton from './ComboButton'
import { Menu } from '../Menu/Menu'

interface HeaderProps {
  showSearchInHeader?: boolean
  buttonColorScheme?: ButtonTypes['colorScheme']
}

const marginLeft = [1, 1, 1, 2] as ResponsiveSpace

export const Header: FC<HeaderProps> = ({
  showSearchInHeader = true,
  buttonColorScheme = 'default',
  children,
}) => {
  const { activeLocale, t } = useI18n()
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const [sideMenuSearchFocus, setSideMenuSearchFocus] = useState(false)
  const { colorScheme } = useContext(ColorSchemeContext)

  const locale = activeLocale
  const english = activeLocale === 'en'
  const isWhite = colorScheme === 'white'

  return (
    <header>
      <Hidden print={true}>
        <SkipToMainContent />
        <FixedNav />
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
                    <Hidden above="sm" inline>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="flexEnd"
                        width="full"
                      >
                        <ComboButton
                          showSearch={showSearchInHeader}
                          sideBarMenuOpen={() => {
                            setSideMenuSearchFocus(false)
                            setSideMenuOpen(true)
                          }}
                          sideMenuSearchFocus={() => {
                            setSideMenuSearchFocus(true)
                            setSideMenuOpen(true)
                          }}
                        />
                      </Box>
                    </Hidden>
                    {showSearchInHeader && (
                      <>
                        <Hidden below="lg">
                          <Box role="search">
                            <SearchInput
                              id="search_input_header"
                              size="medium"
                              activeLocale={locale}
                              placeholder={t.searchPlaceholder}
                              autocomplete={true}
                              autosuggest={false}
                            />
                          </Box>
                        </Hidden>
                      </>
                    )}
                    <Hidden below="md">
                      <FocusableBox
                        href="//minarsidur.island.is/"
                        marginLeft={marginLeft}
                        borderRadius="large"
                      >
                        <Button
                          colorScheme={buttonColorScheme}
                          variant="utility"
                          icon="person"
                        >
                          {t.login}
                        </Button>
                      </FocusableBox>
                    </Hidden>
                    <Box marginLeft={marginLeft}>
                      <LanguageToggler
                        buttonColorScheme={buttonColorScheme}
                        hideWhenMobile
                      />
                    </Box>
                    <Hidden below="md">
                      <Box marginLeft={marginLeft} position="relative">
                        <Menu />
                      </Box>
                    </Hidden>
                  </Box>
                </Column>
              </Columns>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Hidden>
      {children}
    </header>
  )
}

export default Header
