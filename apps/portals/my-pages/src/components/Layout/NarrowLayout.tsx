import { Box, Hidden, Icon, NavigationItem } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { PortalNavigationItem } from '@island.is/portals/core'
import { useHeaderVisibility } from '../../context/HeaderVisibilityContext'
import {
  GoBack,
  m,
  ModuleAlertBannerSection,
  Navigation,
  ServicePortalNavigationItem,
  useIsMobile,
  useIsPhoneWidth,
} from '@island.is/portals/my-pages/core'
import { ReactNode } from 'react'
import { Link as ReactLink, matchPath } from 'react-router-dom'
import ContentBreadcrumbs from '../../components/ContentBreadcrumbs/ContentBreadcrumbs'
import Sticky from '../Sticky/Sticky'
import * as styles from './Layout.css'
import SidebarLayout from './SidebarLayout'

// Modules opt in to the mobile takeover (hidden breadcrumbs, sub-nav and
// sidebar footer at phone widths) per route via the `mobileTakeover` flag
// on their navigation items — see PortalNavigationItem.
const isMobileTakeoverRoute = (
  pathname: string,
  item?: PortalNavigationItem,
): boolean => {
  if (!item) {
    return false
  }

  const matchesThisRoute =
    item.mobileTakeover && item.path && matchPath(item.path, pathname)

  return (
    Boolean(matchesThisRoute) ||
    (item.children ?? []).some((child) =>
      isMobileTakeoverRoute(pathname, child),
    )
  )
}

interface NarrowLayoutProps {
  activeParent?: PortalNavigationItem
  pathname: string
  height: number
  children: ReactNode
  sidebarFooter?: ReactNode
}

export type SubNavItemType = NavigationItem & { enabled?: boolean }

export const NarrowLayout = ({
  children,
  pathname,
  height,
  activeParent,
  sidebarFooter,
}: NarrowLayoutProps) => {
  const { formatMessage } = useLocale()

  const { isMobile } = useIsMobile()
  const { isPhoneWidth } = useIsPhoneWidth()
  const { headerVisible, headerHeight } = useHeaderVisibility()

  // The takeover is only worth it at true phone widths — narrower than the
  // `md` cutoff isMobile uses.
  const isMobileTakeover =
    isPhoneWidth && isMobileTakeoverRoute(pathname, activeParent)

  // headerHeight is the measured height of the fixed header, so the sticky
  // menu clears whatever it contains (e.g. the delegation banner)
  const stickyHeight = headerVisible ? headerHeight - 1 : -1 // -1 to hide the shadow

  const mapChildren = (item: ServicePortalNavigationItem): SubNavItemType => {
    if (item.children) {
      return {
        title: formatMessage(item.name),
        href: item.path,
        active: item.path ? pathname.includes(item.path) : undefined,
        items: item.children
          .filter((x) => !x.navHide)
          .map((child) => {
            return mapChildren(child)
          }),
        accordion: true,
        enabled: item.enabled,
      }
    } else {
      return {
        title: formatMessage(item.name),
        href: item.path,
        active: pathname === item.path,
        enabled: item.enabled,
      }
    }
  }

  const subNavItems: SubNavItemType[] | undefined = activeParent?.children
    ?.filter((item) => !item.navHide)
    ?.map((item: ServicePortalNavigationItem) => {
      return mapChildren(item)
    })

  const sidebar = (
    <Sticky>
      <Box style={{ marginTop: height }} paddingBottom={4}>
        <GoBack />

        {subNavItems && subNavItems.length > 0 && (
          <Box borderRadius="large" background="blue100">
            <Navigation
              renderLink={(link, item: SubNavItemType | undefined) => {
                return item?.href ? (
                  <ReactLink to={item?.href}>
                    {link}
                    {item.enabled === false && !item.items?.length && (
                      <Icon
                        color="blue600"
                        type="filled"
                        icon="lockClosed"
                        size="small"
                        className={styles.lock}
                      />
                    )}
                  </ReactLink>
                ) : (
                  link
                )
              }}
              asSpan
              baseId={'service-portal-navigation'}
              title={formatMessage(activeParent?.name ?? m.tableOfContents)}
              items={subNavItems ?? []}
              expand
              titleIcon={activeParent?.icon}
            />
          </Box>
        )}
        {sidebarFooter}
      </Box>
    </Sticky>
  )

  // Takeover routes render without the layout chrome at phone widths:
  // no breadcrumbs, mobile sub-nav or footer — the screen is expected to
  // provide its own back navigation.
  if (isMobileTakeover) {
    return (
      <SidebarLayout isSticky={true} sidebarContent={sidebar}>
        <Box
          as="main"
          paddingBottom={9}
          component="main"
          style={{ marginTop: height }}
        >
          <ModuleAlertBannerSection />
          {children}
        </Box>
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout isSticky={true} sidebarContent={sidebar}>
      <Box
        as="main"
        paddingBottom={9}
        component="main"
        style={{ marginTop: height }}
      >
        <ContentBreadcrumbs />
        {isMobile && subNavItems && subNavItems.length > 0 && (
          <Box
            paddingBottom={3}
            width="full"
            className={styles.mobileNav}
            style={{ top: stickyHeight }}
          >
            <Navigation
              renderLink={(link, item) => {
                return item?.href ? (
                  <ReactLink to={item?.href}>{link}</ReactLink>
                ) : (
                  link
                )
              }}
              asSpan
              baseId="service-portal-mobile-navigation"
              title={
                activeParent?.name
                  ? formatMessage(activeParent?.name)
                  : formatMessage(m.tableOfContents)
              }
              items={subNavItems}
              titleIcon={activeParent?.icon}
              isMenuDialog={true}
            />
          </Box>
        )}
        <ModuleAlertBannerSection />
        {children}
        {sidebarFooter && <Hidden above="sm">{sidebarFooter}</Hidden>}
      </Box>
    </SidebarLayout>
  )
}
