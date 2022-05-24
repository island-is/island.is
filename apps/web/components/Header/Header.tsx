/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useContext } from 'react'
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
  Link,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import { FixedNav, SearchInput } from '@island.is/web/components'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { LanguageToggler } from '../LanguageToggler'
import { Menu } from '../Menu/Menu'

interface HeaderProps {
  showSearchInHeader?: boolean
  buttonColorScheme?: ButtonTypes['colorScheme']
  megaMenuData
}

const marginLeft = [1, 1, 1, 2] as ResponsiveSpace

export const Header: FC<HeaderProps> = ({
  showSearchInHeader = true,
  buttonColorScheme = 'default',
  megaMenuData,
  children,
}) => {
  const { activeLocale, t } = useI18n()
  const { colorScheme } = useContext(ColorSchemeContext)
  const { linkResolver } = useLinkResolver()

  const locale = activeLocale
  const english = activeLocale === 'en'
  const isWhite = colorScheme === 'white'

  return (
    <header>
      <Hidden print={true}>
        <FixedNav />
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12" paddingTop={4} paddingBottom={4}>
              <Columns alignY="center" space={2}>
                <Column width="content">
                  <FocusableBox href={english ? '/en' : '/'}>
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
                          placeholder={t.searchPlaceholder}
                          autocomplete={true}
                          autosuggest={false}
                        />
                      </Box>
                    )}

                    <Hidden below="lg">
                      <Box marginLeft={marginLeft}>
                        <Link {...linkResolver('login')} skipTab>
                          <Button
                            colorScheme={buttonColorScheme}
                            variant="utility"
                            icon="person"
                            as="span"
                          >
                            {t.login}
                          </Button>
                        </Link>
                      </Box>
                    </Hidden>

                    <Hidden above="md">
                      <Box marginLeft={marginLeft}>
                        <Link {...linkResolver('login')} skipTab>
                          <Button
                            colorScheme={buttonColorScheme}
                            variant="utility"
                            icon="person"
                            as="span"
                          />
                        </Link>
                      </Box>
                    </Hidden>

                    <Box
                      marginLeft={marginLeft}
                      display={['none', 'none', 'none', 'block']}
                    >
                      <LanguageToggler buttonColorScheme={buttonColorScheme} />
                    </Box>
                    <Box marginLeft={marginLeft}>
                      <Menu
                        {...megaMenuData}
                        buttonColorScheme={buttonColorScheme}
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
