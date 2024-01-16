import { useRef, useState } from 'react'
import {
  Box,
  Hidden,
  Button,
  Logo,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import * as styles from './Header.css'
import { ServicePortalPaths } from '@island.is/service-portal/core'
import { useLocale } from '@island.is/localization'
import { UserLanguageSwitcher, UserMenu } from '@island.is/shared/components'
import { m } from '@island.is/service-portal/core'
import { Link } from 'react-router-dom'
import { useListDocuments } from '@island.is/service-portal/graphql'
import cn from 'classnames'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from 'react-use'
import { PortalPageLoader } from '@island.is/portals/core'
import { useAuth } from '@island.is/auth/react'
import Sidemenu from '../Sidemenu/Sidemenu'
import { DocumentsPaths } from '@island.is/service-portal/documents'
import NotificationButton from '../Notifications/NotificationButton'
export type MenuTypes = 'side' | 'user' | 'notifications' | undefined

interface Props {
  position: number
}
export const Header = ({ position }: Props) => {
  const { formatMessage } = useLocale()
  const [menuOpen, setMenuOpen] = useState<MenuTypes>()
  const { unreadCounter } = useListDocuments()
  const { width } = useWindowSize()
  const ref = useRef<HTMLButtonElement>(null)
  const isMobile = width < theme.breakpoints.md
  const { userInfo: user } = useAuth()
  const badgeActive: keyof typeof styles.badge =
    unreadCounter > 0 ? 'active' : 'inactive'

  return (
    <div className={styles.placeholder}>
      <PortalPageLoader />
      {/*  Inline style to dynamicly change position of header because of alert banners */}
      <header className={styles.header} style={{ top: position }}>
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12" paddingTop={4} paddingBottom={4}>
              <PortalPageLoader />

              <Box width="full">
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  alignItems="center"
                  width="full"
                >
                  <Link to={ServicePortalPaths.Root}>
                    <FocusableBox component="div">
                      <Hidden above="sm">
                        <Logo
                          width={40}
                          height={40}
                          iconOnly
                          id="header-mobile"
                        />
                      </Hidden>
                      <Hidden below="md">
                        <Logo width={136} height={22} id="header" />
                      </Hidden>
                    </FocusableBox>
                  </Link>
                  <Hidden print>
                    <Box
                      display="flex"
                      alignItems="center"
                      flexWrap="nowrap"
                      marginLeft={[1, 1, 2]}
                    >
                      <Hidden below="md">
                        <Box marginRight={[1, 1, 2]} position="relative">
                          <Link to={DocumentsPaths.ElectronicDocumentsRoot}>
                            <Button
                              variant="utility"
                              colorScheme="white"
                              size="small"
                              icon="mail"
                              iconType="outline"
                              type="span"
                              unfocusable
                            >
                              {!isMobile && formatMessage(m.documents)}
                            </Button>
                          </Link>
                          <Box
                            borderRadius="circle"
                            className={cn(styles.badge[badgeActive])}
                          />
                        </Box>
                      </Hidden>

                      {user && <UserLanguageSwitcher user={user} />}
                      {/* Display X icon instead of dots if open in mobile*/}

                      <NotificationButton
                        setMenuState={(val: MenuTypes) => setMenuOpen(val)}
                        showMenu={menuOpen === 'notifications'}
                      />

                      <Box marginRight={[1, 1, 2]}>
                        <Button
                          variant="utility"
                          colorScheme="white"
                          icon={
                            menuOpen === 'side' && isMobile ? 'close' : 'dots'
                          }
                          onClick={() => {
                            menuOpen === 'side' && isMobile
                              ? setMenuOpen(undefined)
                              : setMenuOpen('side')
                          }}
                          ref={ref}
                        >
                          {formatMessage(m.overview)}
                        </Button>
                      </Box>

                      <Sidemenu
                        setSideMenuOpen={(set: boolean) =>
                          setMenuOpen(set ? 'side' : undefined)
                        }
                        sideMenuOpen={menuOpen === 'side'}
                        rightPosition={
                          ref.current?.getBoundingClientRect().right
                        }
                      />

                      <UserMenu
                        setUserMenuOpen={(set: boolean) =>
                          setMenuOpen(
                            set
                              ? 'user'
                              : menuOpen === 'user'
                              ? undefined
                              : menuOpen,
                          )
                        }
                        showLanguageSwitcher={false}
                        userMenuOpen={menuOpen === 'user'}
                      />
                    </Box>
                  </Hidden>
                </Box>
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </header>
    </div>
  )
}

export default Header
