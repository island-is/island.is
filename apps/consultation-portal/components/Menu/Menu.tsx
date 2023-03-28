import {
  Box,
  Logo,
  Button,
  GridColumn,
  GridRow,
  Divider,
  GridContainer,
  Columns,
  Column,
  ResponsiveSpace,
  Hidden,
  FocusableBox,
  UserMenu,
} from '@island.is/island-ui/core'
import * as styles from './Menu.css'
import React from 'react'
import { MenuLogo, MenuLogoMobile } from '../svg'
import { menuItems } from './MenuItems'
import MenuModal from '../Modal/MenuModal'
import { checkActiveHeaderLink, useLogin } from '../../utils/helpers'
import { useRouter } from 'next/router'
import { useUser } from '../../context/UserContext'
type MenuProps = {
  isFrontPage: boolean
}

export const Menu = ({ isFrontPage = false }: MenuProps) => {
  const { LogIn, loginLoading } = useLogin()
  const { isAuthenticated, user, logoutUser } = useUser()

  const router = useRouter()
  const marginLeft = [1, 1, 1, 2] as ResponsiveSpace
  const biggerMarginLeft = [3, 3, 3, 4] as ResponsiveSpace

  return (
    <header className={styles.menu}>
      <Hidden print={true}>
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12" paddingTop={3} paddingBottom={3}>
              <Columns alignY="center" space={2}>
                {isFrontPage && (
                  <Column width="content">
                    <FocusableBox href="https://island.is/">
                      <Logo iconOnly width={26} />
                    </FocusableBox>
                  </Column>
                )}
                {!isFrontPage && (
                  <Hidden below="xl">
                    <Column width="content">
                      <FocusableBox href="https://island.is/">
                        <Logo iconOnly width={26} />
                      </FocusableBox>
                    </Column>
                  </Hidden>
                )}
                {!isFrontPage && (
                  <>
                    <Hidden below="xl">
                      <Column width="content">
                        <Box>
                          <Box
                            style={{
                              transform: 'rotate(90deg)',
                              width: 56,
                            }}
                            marginX={1}
                          >
                            <Divider />
                          </Box>
                        </Box>
                      </Column>
                    </Hidden>
                    <Column width="content">
                      <Hidden below="md">
                        <FocusableBox href="/" alignItems="center">
                          <MenuLogo />
                        </FocusableBox>
                      </Hidden>
                      <Hidden above="sm">
                        <FocusableBox href="/" alignItems="center">
                          <MenuLogoMobile />
                        </FocusableBox>
                      </Hidden>
                    </Column>
                  </>
                )}

                <Column>
                  <Hidden below="xl">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flexEnd"
                      width="full"
                    >
                      {menuItems.map((item, index) => {
                        return (
                          <FocusableBox
                            marginLeft={index !== 0 ? marginLeft : 0}
                            key={index}
                            href={item.href}
                          >
                            <div
                              style={{
                                backgroundColor: checkActiveHeaderLink(
                                  router,
                                  item.href,
                                )
                                  ? '#00E4CA'
                                  : 'transparent',
                                borderRadius: '8px',
                              }}
                            >
                              <Button variant="utility" size="small">
                                {item.label}
                              </Button>
                            </div>
                          </FocusableBox>
                        )
                      })}
                      <Box marginLeft={biggerMarginLeft}>
                        {isAuthenticated ? (
                          <UserMenu
                            username={user?.name}
                            authenticated={isAuthenticated}
                            language={'IS'}
                            onLogout={logoutUser}
                            dropdownItems={<Divider />}
                          />
                        ) : (
                          <Button
                            size="small"
                            onClick={LogIn}
                            loading={loginLoading}
                          >
                            Innskráning
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Hidden>
                  <Hidden above="lg">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="flexEnd"
                      width="full"
                    >
                      <MenuModal
                        baseId="menuModal"
                        modalLabel="Menu modal"
                        isLoggedIn={isAuthenticated}
                        logIn={LogIn}
                        logOut={logoutUser}
                        router={router}
                        isFrontPage={isFrontPage}
                      />
                    </Box>
                  </Hidden>
                </Column>
              </Columns>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Hidden>
    </header>
  )
}
export default Menu
