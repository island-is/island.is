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
import React, { useContext } from 'react'
import { menuItems, MenuModal } from './components'
import { useIsMobile, useLogIn, useLogOut } from '../../../../hooks'
import { checkActiveHeaderLink } from '../../utils'
import { useRouter } from 'next/router'
import { UserContext } from '../../../../context'
import localization from '../../Layout.json'
import { LogoText } from '../../../../components/'

type MenuProps = {
  isFrontPage?: boolean
}

const Menu = ({ isFrontPage = false }: MenuProps) => {
  const loc = localization.menu.menu
  const { isAuthenticated, user } = useContext(UserContext)
  const { isMobile } = useIsMobile()

  const router = useRouter()
  const marginLeft = [1, 1, 1, 2] as ResponsiveSpace
  const biggerMarginLeft = [3, 3, 3, 4] as ResponsiveSpace

  const LogIn = useLogIn()
  const LogOut = useLogOut()

  return (
    <header className={styles.menu}>
      <Hidden print={true}>
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12" paddingTop={3} paddingBottom={3}>
              <Columns alignY="center" space={2}>
                {isFrontPage && (
                  <Column width="content">
                    <FocusableBox href="https://island.is">
                      <Logo
                        iconOnly={isMobile ? true : false}
                        width={isMobile ? 28 : 160}
                        height={isMobile ? 28 : 28}
                      />
                    </FocusableBox>
                  </Column>
                )}
                {!isFrontPage && (
                  <>
                    {!isMobile && (
                      <>
                        <Column width="content">
                          <FocusableBox href="https://island.is">
                            <Logo iconOnly height={28} width={28} />
                          </FocusableBox>
                        </Column>
                        <Column width="content">
                          <Box
                            style={{
                              transform: 'rotate(90deg)',
                              width: 56,
                            }}
                            marginX={1}
                          >
                            <Divider />
                          </Box>
                        </Column>
                      </>
                    )}
                    <Column width="content">
                      <FocusableBox href="/" alignItems="center">
                        <LogoText isSmall />
                      </FocusableBox>
                    </Column>
                  </>
                )}
                <Column>
                  {isMobile ? (
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
                        isFrontPage={isFrontPage}
                      />
                    </Box>
                  ) : (
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
                                backgroundColor: checkActiveHeaderLink({
                                  router: router,
                                  link: item.href,
                                })
                                  ? '#00E4CA'
                                  : 'transparent',
                                borderRadius: '8px',
                              }}
                            >
                              <Button
                                variant="utility"
                                size="small"
                                dataTestId={item.testId}
                              >
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
                            language={'is'}
                            onLogout={LogOut}
                            dropdownItems={<Divider />}
                          />
                        ) : (
                          <Button
                            size="small"
                            onClick={LogIn}
                            dataTestId="menu-login-btn"
                          >
                            {loc.buttonLabel}
                          </Button>
                        )}
                      </Box>
                    </Box>
                  )}
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
