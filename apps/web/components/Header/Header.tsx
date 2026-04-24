/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  FC,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'

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
import { FixedNav } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'
import { LayoutProps } from '@island.is/web/layouts/main'

import { LanguageToggler } from '../LanguageToggler'
import { DesktopNav } from './DesktopNav'
import { DesktopSearchPanel } from './DesktopSearchPanel'
import type { HeaderNavData } from './headerNavData'
import { LoginButton } from './LoginButton'
import {
  MobileNavMenuButton,
  MobileNavPanel,
  type MobileNavPanelHandle,
  MobileNavSearchButton,
} from './MobileNav'
import * as styles from './Header.css'

interface HeaderProps {
  showSearchInHeader?: boolean
  buttonColorScheme?: ButtonTypes['colorScheme']
  languageToggleQueryParams?: LayoutProps['languageToggleQueryParams']
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  megaMenuData
  headerNavData?: HeaderNavData | null
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
  headerNavData,
  languageToggleQueryParams,
  organizationSearchFilter,
  searchPlaceholder,
  customTopLoginButtonItem,
  loginButtonType = 'dropdown',
  languageToggleHrefOverride,
  children,
}) => {
  const { activeLocale } = useI18n()
  const { colorScheme } = useContext(ColorSchemeContext)
  const [isDesktopNavOpen, setIsDesktopNavOpen] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false)
  const handleDesktopNavOpenChange = useCallback(
    (isOpen: boolean) => setIsDesktopNavOpen(isOpen),
    [],
  )
  const handleMobileNavOpenChange = useCallback(
    (isOpen: boolean) => setIsMobileNavOpen(isOpen),
    [],
  )
  const handleDesktopSearchOpenChange = useCallback(
    (isOpen: boolean) => setIsDesktopSearchOpen(isOpen),
    [],
  )
  const isNavOpen = isDesktopNavOpen || isMobileNavOpen || isDesktopSearchOpen

  const mobileNavRef = useRef<MobileNavPanelHandle>(null)
  const mobileSearchBtnRef = useRef<HTMLButtonElement>(null)
  const mobileMenuBtnRef = useRef<HTMLButtonElement>(null)
  // Memoize so the panel's outside-click effect doesn't re-subscribe on
  // every render. The ref objects themselves are stable; only `.current`
  // changes when the buttons mount/unmount.
  const mobileTriggerRefs = useMemo(
    () => [mobileSearchBtnRef, mobileMenuBtnRef],
    [],
  )

  const english = activeLocale === 'en'
  const isWhite = colorScheme === 'white'

  const languageToggler = (
    <LanguageToggler
      buttonColorScheme={buttonColorScheme}
      queryParams={languageToggleQueryParams}
      hrefOverride={languageToggleHrefOverride}
    />
  )
  const loginButton = (
    <LoginButton
      colorScheme={buttonColorScheme}
      topItem={customTopLoginButtonItem}
      type={loginButtonType}
    />
  )

  return (
    <header
      className={`${styles.header} ${isNavOpen ? styles.headerWithShadow : ''}`}
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
                        <DesktopNav
                          data={headerNavData ?? undefined}
                          onOpenChange={handleDesktopNavOpenChange}
                        />
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
                      {/* Desktop: Search → Language → My Pages */}
                      <Hidden below="lg">
                        <Box display="flex" alignItems="center">
                          {showSearchInHeader && (
                            <DesktopSearchPanel
                              organizationSearchFilter={
                                organizationSearchFilter
                              }
                              searchPlaceholder={searchPlaceholder}
                              onOpenChange={handleDesktopSearchOpenChange}
                            />
                          )}
                          <Box marginLeft={marginLeft}>{languageToggler}</Box>
                          <Box marginLeft={marginLeft}>{loginButton}</Box>
                        </Box>
                      </Hidden>

                      {/* Mobile: My Pages → Search → Language → Menu.
                          Search/Menu triggers render only when the panel
                          they control will actually render — i.e. when
                          headerNavData is available (MobileNavPanel returns
                          null otherwise, making the triggers inert). */}
                      <Hidden above="md">
                        <Box display="flex" alignItems="center">
                          {loginButton}
                          {headerNavData && showSearchInHeader && (
                            <Box marginLeft={marginLeft}>
                              <MobileNavSearchButton
                                ref={mobileSearchBtnRef}
                                isOpen={isMobileNavOpen}
                                onClick={() =>
                                  mobileNavRef.current?.openAndFocusSearch()
                                }
                              />
                            </Box>
                          )}
                          <Box marginLeft={marginLeft}>{languageToggler}</Box>
                          {headerNavData && (
                            <Box marginLeft={marginLeft}>
                              <MobileNavMenuButton
                                ref={mobileMenuBtnRef}
                                isOpen={isMobileNavOpen}
                                onClick={() => mobileNavRef.current?.toggle()}
                              />
                            </Box>
                          )}
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
      {/* Mobile nav panel — fixed-positioned so DOM placement doesn't
          matter visually. Kept outside the Hidden wrapper so the
          imperative handle is always reachable from the Header
          (including across breakpoint changes). */}
      <Hidden above="md">
        <MobileNavPanel
          ref={mobileNavRef}
          data={headerNavData ?? undefined}
          organizationSearchFilter={organizationSearchFilter}
          searchPlaceholder={searchPlaceholder}
          onOpenChange={handleMobileNavOpenChange}
          triggerRefs={mobileTriggerRefs}
        />
      </Hidden>
      {children}
    </header>
  )
}

export default Header
