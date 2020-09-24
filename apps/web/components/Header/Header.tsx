/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState, useContext } from 'react'
import { useRouter } from 'next/router'
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
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import routeNames from '@island.is/web/i18n/routeNames'
import { SearchInput } from '../'
import { LanguageToggler } from '../LanguageToggler'
import { SideMenu } from '../SideMenu'

interface HeaderProps {
  showSearchInHeader?: boolean
}

const marginLeft = [1, 1, 1, 2] as ResponsiveSpace

export const Header: FC<HeaderProps> = ({ showSearchInHeader = true }) => {
  const { activeLocale, t } = useI18n()
  const Router = useRouter()
  const { makePath } = routeNames(activeLocale)
  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  const { colorScheme } = useContext(ColorSchemeContext)

  const locale = activeLocale
  const english = activeLocale === 'en'
  const isWhite = colorScheme === 'white'

  const betaTag = (
    <div style={{ marginLeft: '8px', marginTop: 'auto' }}>
      <svg
        width="47"
        height="26"
        viewBox="0 0 47 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="0.945068" width="45.1098" height="26" rx="4" fill="#F2F7FF" />
        <path
          d="M8.94507 9.16089H12.4981C12.8134 9.16089 13.0957 9.20855 13.3451 9.30389C13.6017 9.39922 13.8181 9.53122 13.9941 9.69989C14.1701 9.86855 14.3021 10.0776 14.3901 10.3269C14.4854 10.5689 14.5331 10.8366 14.5331 11.1299C14.5331 11.4232 14.4927 11.6726 14.4121 11.8779C14.3387 12.0759 14.2361 12.2409 14.1041 12.3729C13.9794 12.5049 13.8327 12.6039 13.6641 12.6699C13.5027 12.7359 13.3341 12.7726 13.1581 12.7799V12.8459C13.3267 12.8459 13.5064 12.8789 13.6971 12.9449C13.8951 13.0109 14.0747 13.1172 14.2361 13.2639C14.4047 13.4032 14.5441 13.5866 14.6541 13.8139C14.7641 14.0339 14.8191 14.3089 14.8191 14.6389C14.8191 14.9469 14.7677 15.2366 14.6651 15.5079C14.5697 15.7719 14.4341 16.0029 14.2581 16.2009C14.0821 16.3989 13.8731 16.5566 13.6311 16.6739C13.3891 16.7839 13.1251 16.8389 12.8391 16.8389H8.94507V9.16089ZM10.3971 15.6069H12.4211C12.6997 15.6069 12.9161 15.5372 13.0701 15.3979C13.2241 15.2512 13.3011 15.0422 13.3011 14.7709V14.3969C13.3011 14.1256 13.2241 13.9166 13.0701 13.7699C12.9161 13.6232 12.6997 13.5499 12.4211 13.5499H10.3971V15.6069ZM10.3971 12.3619H12.1901C12.4541 12.3619 12.6594 12.2922 12.8061 12.1529C12.9527 12.0062 13.0261 11.8046 13.0261 11.5479V11.2069C13.0261 10.9502 12.9527 10.7522 12.8061 10.6129C12.6594 10.4662 12.4541 10.3929 12.1901 10.3929H10.3971V12.3619Z"
          fill="#0061FF"
        />
        <path
          d="M17.339 16.8389V9.16089H22.399V10.4479H18.791V12.3069H21.981V13.5939H18.791V15.5519H22.399V16.8389H17.339Z"
          fill="#0061FF"
        />
        <path
          d="M28.0487 10.4479V16.8389H26.5967V10.4479H24.4187V9.16089H30.2267V10.4479H28.0487Z"
          fill="#0061FF"
        />
        <path
          d="M36.5478 16.8389L35.9318 14.8809H33.2038L32.5988 16.8389H31.1248L33.6988 9.16089H35.5028L38.0548 16.8389H36.5478ZM34.5898 10.4809H34.5348L33.5558 13.6379H35.5798L34.5898 10.4809Z"
          fill="#0061FF"
        />
      </svg>{' '}
    </div>
  )

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
                {betaTag}
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
                        placeholder={t.searchPlaceholder}
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
                    borderRadius="large"
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
                    leftIcon="burger"
                  >
                    {t.menuCaption}
                  </Button>
                </Box>
              </Box>
            </Column>
          </Columns>
        </GridColumn>
      </GridRow>
      <ColorSchemeContext.Provider value={{ colorScheme: 'blue' }}>
        <SideMenu
          isVisible={sideMenuOpen}
          handleClose={() => setSideMenuOpen(false)}
        />
      </ColorSchemeContext.Provider>
    </GridContainer>
  )
}

export default Header
