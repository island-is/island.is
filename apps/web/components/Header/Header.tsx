/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useContext } from 'react'

import {
  Box,
  ButtonTypes,
  ColorSchemeContext,
  Column,
  Columns,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Logo,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import { webMenuButtonClicked } from '@island.is/plausible'
import { FixedNav, SearchInput } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'
import { LayoutProps } from '@island.is/web/layouts/main'

import { LanguageToggler } from '../LanguageToggler'
import { Menu } from '../Menu/Menu'
import { LoginButton } from './LoginButton'

interface HeaderProps {
  showSearchInHeader?: boolean
  buttonColorScheme?: ButtonTypes['colorScheme']
  languageToggleQueryParams?: LayoutProps['languageToggleQueryParams']
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  megaMenuData
  organizationSearchFilter?: string
  searchPlaceholder?: string
  customTopLoginButtonItem?: LayoutProps['customTopLoginButtonItem']
  loginButtonType?: 'dropdown' | 'link'
}

const marginLeft = [1, 1, 1, 2] as ResponsiveSpace

export const Header: FC<React.PropsWithChildren<HeaderProps>> = ({
  showSearchInHeader = true,
  buttonColorScheme = 'default',
  megaMenuData,
  languageToggleQueryParams,
  organizationSearchFilter,
  searchPlaceholder,
  customTopLoginButtonItem,
  loginButtonType = 'dropdown',
  children,
}) => {
  const { activeLocale, t } = useI18n()
  const { colorScheme } = useContext(ColorSchemeContext)

  const locale = activeLocale
  const english = activeLocale === 'en'
  const isWhite = colorScheme === 'white'

  return (
    <header>
      <Hidden print={true}>
        <FixedNav organizationSearchFilter={organizationSearchFilter} />
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12" paddingTop={4} paddingBottom={4}>
              <Columns alignY="center" space={2}>
                <Column width="content">
                  <FocusableBox
                    href={english ? '/en' : '/'}
                    data-testid="link-back-home"
                  >
                    <Hidden above="md">
                      <Logo
                        id="header-logo-icon"
                        width={40}
                        iconOnly
                        solid={isWhite}
                      />
                    </Hidden>
                    <Hidden below="lg">
                      <Logo id="header-logo" width={160} solid={isWhite} />
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
                      <Box
                        role="search"
                        display={['none', 'none', 'none', 'block']}
                      >
                        <SearchInput
                          id="search_input_header"
                          size="medium"
                          activeLocale={locale}
                          placeholder={searchPlaceholder ?? t.searchPlaceholder}
                          autocomplete={true}
                          autosuggest={true}
                          organization={organizationSearchFilter}
                        />
                      </Box>
                    )}

                    <Box marginLeft={marginLeft}>
                      <LoginButton
                        colorScheme={buttonColorScheme}
                        topItem={customTopLoginButtonItem}
                        type={loginButtonType}
                      />
                    </Box>

                    <Box
                      marginLeft={marginLeft}
                      display={['none', 'none', 'none', 'block']}
                    >
                      <LanguageToggler
                        buttonColorScheme={buttonColorScheme}
                        queryParams={languageToggleQueryParams}
                      />
                    </Box>
                    <Box marginLeft={marginLeft}>
                      <Menu
                        {...megaMenuData}
                        buttonColorScheme={buttonColorScheme}
                        onMenuOpen={webMenuButtonClicked}
                        organizationSearchFilter={organizationSearchFilter}
                        languageToggleQueryParams={languageToggleQueryParams}
                      />
                    </Box>
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
