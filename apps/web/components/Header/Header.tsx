/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useState } from 'react'
import Link from 'next/link'
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
  ButtonProps,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import useRouteNames from '@island.is/web/i18n/useRouteNames'
import { SearchInput } from '../'
import { LanguageToggler } from '../LanguageToggler'
import { SideMenu } from '../SideMenu'
import { tempTabs } from '../../json'

interface HeaderProps {
  showSearchInHeader?: boolean
  white?: boolean
  on?: ButtonProps['on']
}

const marginLeft = [1, 1, 1, 2] as ResponsiveSpace

export const Header: FC<HeaderProps> = ({
  showSearchInHeader = true,
  white = false,
  on = 'white',
}) => {
  const { activeLocale, t } = useI18n()
  const Router = useRouter()
  const { makePath } = useRouteNames(activeLocale)
  const [sideMenuOpen, setSideMenuOpen] = useState(false)

  const locale = activeLocale
  const english = activeLocale === 'en'

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
                    <Logo width={40} iconOnly solidColor={white && 'white'} />
                  </Hidden>
                  <Hidden below="lg">
                    <Logo width={160} solidColor={white && 'white'} />
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
                        on={on}
                      />
                    </Hidden>
                    <Hidden above="md">
                      <Button
                        variant="menu"
                        icon="search"
                        white={white}
                        on={on}
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
                    <Button
                      variant="menu"
                      leftIcon="user"
                      white={white}
                      on={on}
                    >
                      {t.login}
                    </Button>
                  </Link>
                </Box>
                <Box marginLeft={marginLeft}>
                  <LanguageToggler white={white} on={on} hideWhenMobile />
                </Box>
                <Box marginLeft={marginLeft} position="relative">
                  <Button
                    variant="menu"
                    white={white}
                    on={on}
                    onClick={() => setSideMenuOpen(true)}
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
