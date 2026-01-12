import { DocumentsScope } from '@island.is/auth/scopes'
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
import { SERVICE_PORTAL_HEADER_HEIGHT_SM } from '@island.is/portals/my-pages/constants'
import {
  LinkResolver,
  ServicePortalPaths,
  m,
  useScrollPosition,
} from '@island.is/portals/my-pages/core'
import { DocumentsPaths } from '@island.is/portals/my-pages/documents'
import { useUserInfo } from '@island.is/react-spa/bff'
import { UserLanguageSwitcher, UserMenu } from '@island.is/shared/components'
import cn from 'classnames'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useWindowSize } from 'react-use'
import NotificationButton from '../Notifications/NotificationButton'
import { SearchInput } from '../SearchInput/SearchInput'
import Sidemenu from '../Sidemenu/Sidemenu'
import * as styles from './Header.css'

export type MenuTypes = 'side' | 'user' | 'notifications' | undefined
interface Props {
  position: number
  includeSearchInHeader?: boolean
  onHeaderVisibilityChange?: (visible: boolean) => void
}
export const Header = ({
  position,
  includeSearchInHeader = false,
  onHeaderVisibilityChange,
}: Props) => {
  const { formatMessage } = useLocale()
  const [menuOpen, setMenuOpen] = useState<MenuTypes>()
  const ref = useRef<HTMLButtonElement>(null)
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  const user = useUserInfo()

  const hasNotificationsDelegationAccess = user?.scopes?.includes(
    DocumentsScope.main,
  )
  const [headerVisible, setHeaderVisible] = useState<boolean>(true)
  const headerVisibleRef = useRef<boolean>(true)
  const lastScrollYRef = useRef<number>(0)
  const [disableTransition, setDisableTransition] = useState<boolean>(false)
  const location = useLocation()
  const isNavigatingRef = useRef<boolean>(false)

  // Memoize the visibility callback to prevent unnecessary re-renders
  const notifyVisibilityChange = useCallback(
    (visible: boolean) => {
      isMobile && onHeaderVisibilityChange?.(visible)
    },
    [isMobile, onHeaderVisibilityChange],
  )

  // Reset header state when pathname changes to ensure header is visible on navigation
  useEffect(() => {
    if (!isMobile) return
    isNavigatingRef.current = true
    setDisableTransition(true)
    setHeaderVisible(true)
    headerVisibleRef.current = true
    lastScrollYRef.current = 0
    notifyVisibilityChange(true)

    // Re-enable transitions after a brief delay
    const timeout = setTimeout(() => {
      setDisableTransition(false)
      isNavigatingRef.current = false
    }, 50)

    return () => {
      clearTimeout(timeout)
      isNavigatingRef.current = false
    }
  }, [isMobile, location.pathname, notifyVisibilityChange])

  // Scrolling logic to show/hide header based on scroll direction and position
  useScrollPosition(
    ({ currPos }) => {
      if (!isMobile || isNavigatingRef.current) return // Skip during navigation

      const currentScrollY = -currPos.y
      const lastScrollY = lastScrollYRef.current
      const scrollingDown = currentScrollY > lastScrollY
      const scrollingUp = currentScrollY < lastScrollY
      const scrollThreshold = SERVICE_PORTAL_HEADER_HEIGHT_SM

      // Show header when scrolling up or at top of page
      if (scrollingUp || currentScrollY < scrollThreshold) {
        if (!headerVisibleRef.current) {
          headerVisibleRef.current = true
          setHeaderVisible(true)
          notifyVisibilityChange(true)
        }
      }
      // Hide header when scrolling down and past threshold
      else if (scrollingDown && currentScrollY > scrollThreshold) {
        if (headerVisibleRef.current) {
          headerVisibleRef.current = false
          setHeaderVisible(false)
          notifyVisibilityChange(false)
        }
      }

      lastScrollYRef.current = currentScrollY
    },
    [isMobile, notifyVisibilityChange],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    null,
    false,
    100, // Reduced throttle for smoother response
  )

  return (
    <div className={styles.placeholder}>
      <PortalPageLoader />
      {/*  Inline style to dynamicly change position of header because of alert banners */}
      <header
        className={cn(styles.header, {
          [styles.headerHidden]: !headerVisible && isMobile,
        })}
        style={{
          top: position,
          transition: disableTransition ? 'none' : undefined,
        }}
      >
        <GridContainer>
          <GridRow>
            <GridColumn
              span="12/12"
              paddingTop={[2, 2, 2, 4]}
              paddingBottom={[2, 2, 2, 4]}
            >
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
                  <Box
                    width="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="flexEnd"
                    flexWrap="nowrap"
                    marginLeft={[1, 1, 2]}
                    printHidden
                  >
                    {includeSearchInHeader && (
                      <Box
                        marginRight={[1, 1, 2]}
                        flexGrow={isMobile ? 0 : 1}
                        className={styles.search}
                      >
                        <SearchInput
                          placeholder={formatMessage(m.searchOnMyPages)}
                          buttonAriaLabel={formatMessage(m.searchOnMyPages)}
                          whiteMenuBackground
                          hideInput={isMobile}
                          box={{ marginLeft: 'auto' }}
                        />
                      </Box>
                    )}
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
                            aria-label={formatMessage(m.openDocuments)}
                            unfocusable
                          />
                          <span className={helperStyles.srOnly}>
                            {formatMessage(m.openDocuments)}
                          </span>
                        </LinkResolver>
                      </Box>
                    </Hidden>

                    <NotificationButton
                      setMenuState={(val: MenuTypes) => setMenuOpen(val)}
                      showMenu={menuOpen === 'notifications'}
                      disabled={!hasNotificationsDelegationAccess}
                    />

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
                        aria-label={formatMessage(m.overview)}
                        ref={ref}
                      >
                        <Hidden below="sm">{formatMessage(m.overview)}</Hidden>
                      </Button>
                    </Box>

                    <Sidemenu
                      setSideMenuOpen={(set: boolean) =>
                        setMenuOpen(set ? 'side' : undefined)
                      }
                      sideMenuOpen={menuOpen === 'side'}
                      rightPosition={ref.current?.getBoundingClientRect().right}
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
                      iconOnlyMobile
                      showLanguageSwitcher={false}
                      userMenuOpen={menuOpen === 'user'}
                    />
                  </Box>
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
