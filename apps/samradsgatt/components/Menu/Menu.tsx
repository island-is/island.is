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
import React, { useState } from 'react'
import { MenuLogo } from '../svg'
import { menuItems } from './MenuItems'
import MenuModal from '../Modal/MenuModal'
type MenuProps = {
  showIcon: boolean
}

export const Menu = ({ showIcon = true }: MenuProps) => {
  const marginLeft = [1, 1, 1, 2] as ResponsiveSpace
  const biggerMarginLeft = [3, 3, 3, 4] as ResponsiveSpace

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const LogIn = () => setIsLoggedIn(true)
  const LogOut = () => setIsLoggedIn(false)

  const onLogout = () => setIsLoggedIn(false)

  const user = {
    name: 'Halldór Andri Jónsson',
    authenticated: true,
    language: 'is',
  }

  return (
    <>
      <header className={styles.menu}>
        <Hidden print={true}>
          <GridContainer>
            <GridRow>
              <GridColumn span="12/12" paddingTop={3} paddingBottom={3}>
                <Columns alignY="center" space={2}>
                  <Hidden below="xl">
                    <Column width="content">
                      <FocusableBox href="/">
                        <Logo iconOnly width={26} />
                      </FocusableBox>
                    </Column>
                  </Hidden>
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
                    <FocusableBox href="/">
                      <MenuLogo />
                    </FocusableBox>
                  </Column>

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
                              <Button variant="utility" size="small">
                                {item.label}
                              </Button>
                            </FocusableBox>
                          )
                        })}
                        <Box marginLeft={biggerMarginLeft}>
                          {isLoggedIn ? (
                            <UserMenu
                              username={user.name}
                              authenticated={user.authenticated}
                              language={user.language}
                              onLogout={onLogout}
                              dropdownItems={<Divider />}
                            />
                          ) : (
                            <Button
                              size="small"
                              onClick={() => setIsLoggedIn(true)}
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
                          isLoggedIn={isLoggedIn}
                          logIn={LogIn}
                          logOut={LogOut}
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
      <Divider />
    </>
  )
}
export default Menu
