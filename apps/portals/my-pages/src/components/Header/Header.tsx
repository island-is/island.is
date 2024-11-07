import { useAuth } from '@island.is/auth/react'
import {
  Box,
  Button,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Logo,
} from '@island.is/island-ui/core'
import { helperStyles, theme } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { PortalPageLoader } from '@island.is/portals/core'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import {
  LinkResolver,
  ServicePortalPaths,
  m,
} from '@island.is/service-portal/core'
import { DocumentsPaths } from '@island.is/service-portal/documents'
import { UserLanguageSwitcher, UserMenu } from '@island.is/shared/components'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useWindowSize } from 'react-use'
import NotificationButton from '../Notifications/NotificationButton'
import Sidemenu from '../Sidemenu/Sidemenu'
import * as styles from './Header.css'
import { DocumentsScope } from '@island.is/auth/scopes'
export type MenuTypes = 'side' | 'user' | 'notifications' | undefined

interface Props {
  position: number
}
export const Header = ({ position }: Props) => {
  const { formatMessage } = useLocale()
  const [menuOpen, setMenuOpen] = useState<MenuTypes>()
  const { width } = useWindowSize()
  const ref = useRef<HTMLButtonElement>(null)
  const isMobile = width < theme.breakpoints.md
  const { userInfo: user } = useAuth()

  // Notification feature flag. Remove after feature is live.
  const [enableNotificationFlag, setEnableNotificationFlag] =
    useState<boolean>(false)
  const featureFlagClient = useFeatureFlagClient()
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        `isServicePortalNotificationsPageEnabled`,
        false,
      )
      if (ffEnabled) {
        setEnableNotificationFlag(ffEnabled as boolean)
      }
    }
    isFlagEnabled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hasNotificationsDelegationAccess = user?.scopes?.includes(
    DocumentsScope.main,
  )

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
                          <LinkResolver
                            href={DocumentsPaths.ElectronicDocumentsRoot}
                          >
                            <Button
                              icon="mail"
                              iconType="outline"
                              colorScheme="white"
                              size="small"
                              type="span"
                              variant="utility"
                              unfocusable
                            />
                            <span className={helperStyles.srOnly}>
                              {formatMessage(m.openDocuments)}
                            </span>
                          </LinkResolver>
                        </Box>
                      </Hidden>

                      {enableNotificationFlag && (
                        <NotificationButton
                          setMenuState={(val: MenuTypes) => setMenuOpen(val)}
                          showMenu={menuOpen === 'notifications'}
                          disabled={!hasNotificationsDelegationAccess}
                        />
                      )}

                      {user && <UserLanguageSwitcher />}

                      <Box className={styles.overview} marginRight={[1, 1, 2]}>
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
                          <Hidden below="sm">
                            {formatMessage(m.overview)}
                          </Hidden>
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
