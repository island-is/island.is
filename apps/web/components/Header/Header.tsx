/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useCallback, useContext, useState } from 'react'

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
import { FixedNav, SearchInput } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'
import { LayoutProps } from '@island.is/web/layouts/main'

import { LanguageToggler } from '../LanguageToggler'
import { DesktopNav } from './DesktopNav'
import { LoginButton } from './LoginButton'
import { MobileNav } from './MobileNav'
import * as styles from './Header.css'

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
  languageToggleHrefOverride?: LayoutProps['languageToggleHrefOverride']
}

const marginLeft = [1, 1, 1, 2] as ResponsiveSpace

export const Header: FC<React.PropsWithChildren<HeaderProps>> = ({
  showSearchInHeader = true,
  buttonColorScheme = 'default',
  // megaMenuData is still passed in from the layout but no longer consumed
  // here — the old fullscreen Menu has been replaced by DesktopNav + MobileNav.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  megaMenuData: _megaMenuData,
  languageToggleQueryParams,
  organizationSearchFilter,
  searchPlaceholder,
  customTopLoginButtonItem,
  loginButtonType = 'dropdown',
  languageToggleHrefOverride,
  children,
}) => {
  const { activeLocale, t } = useI18n()
  const { colorScheme } = useContext(ColorSchemeContext)
  const [isDesktopNavOpen, setIsDesktopNavOpen] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const handleDesktopNavOpenChange = useCallback(
    (isOpen: boolean) => setIsDesktopNavOpen(isOpen),
    [],
  )
  const handleMobileNavOpenChange = useCallback(
    (isOpen: boolean) => setIsMobileNavOpen(isOpen),
    [],
  )
  const isNavOpen = isDesktopNavOpen || isMobileNavOpen

  const locale = activeLocale
  const english = activeLocale === 'en'
  const isWhite = colorScheme === 'white'

  return (
    <header
      className={`${styles.header} ${
        isNavOpen ? styles.headerWithShadow : ''
      }`}
    >
      <Hidden print={true}>
        <FixedNav organizationSearchFilter={organizationSearchFilter} />
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12">
              <div className={styles.headerRow}>
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
                <Column width="content">
                  <Hidden below="lg">
                    <Box marginLeft={3}>
                      <DesktopNav onOpenChange={handleDesktopNavOpenChange} />
                    </Box>
                  </Hidden>
                </Column>
                <Column>
                  <Box
                    className={styles.compactUtilityButtons}
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

                    <Hidden below="lg">
                      <Box marginLeft={marginLeft}>
                        <LoginButton
                          colorScheme={buttonColorScheme}
                          topItem={customTopLoginButtonItem}
                          type={loginButtonType}
                        />
                      </Box>
                    </Hidden>

                    <Box
                      marginLeft={marginLeft}
                      display={['none', 'none', 'none', 'block']}
                    >
                      <LanguageToggler
                        buttonColorScheme={buttonColorScheme}
                        queryParams={languageToggleQueryParams}
                        hrefOverride={languageToggleHrefOverride}
                      />
                    </Box>
                    <Hidden above="md">
                      <Box marginLeft={marginLeft}>
                        <MobileNav
                          organizationSearchFilter={organizationSearchFilter}
                          searchPlaceholder={searchPlaceholder}
                          onOpenChange={handleMobileNavOpenChange}
                        />
                      </Box>
                    </Hidden>
                  </Box>
                </Column>
              </Columns>
              </div>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Hidden>
      {children}
    </header>
  )
}

export default Header
