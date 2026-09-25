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
import cn from 'classnames'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { Link as ReactLink, matchPath } from 'react-router-dom'
import ContentBreadcrumbs from '../../components/ContentBreadcrumbs/ContentBreadcrumbs'
import * as styles from './Layout.css'
import SidebarLayout from './SidebarLayout'
import { useScrollShadows } from './useScrollShadows'

/* Modules opt in to the mobile takeover (hidden breadcrumbs, sub-nav and
   sidebar footer at phone widths) per route via the `mobileTakeover` flag
   on their navigation items — see PortalNavigationItem. */
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

  const sidebarRef = useRef<HTMLDivElement>(null)
  const { atTop, atBottom } = useScrollShadows(sidebarRef)

  /* The takeover is only worth it at true phone widths — narrower than the
   `md` cutoff isMobile uses. */
  const isTakeoverRoute = useMemo(
    () => isMobileTakeoverRoute(pathname, activeParent),
    [pathname, activeParent],
  )
  const isMobileTakeover = isPhoneWidth && isTakeoverRoute

  // headerHeight is the measured height of the fixed header, so the sticky
  // menu clears whatever it contains (e.g. the delegation banner). No overlap:
  // the header sits above the menu and would cover its top border.
  const stickyHeight = headerVisible ? headerHeight : 0

  const sentinelRef = useRef<HTMLDivElement>(null)
  const [isStuck, setIsStuck] = useState(false)

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
    <>
      <Box
        className={cn(styles.stickyGoBack, {
          [styles.stickyGoBackShadow]: !atTop,
        })}
        paddingBottom={2}
      >
        <GoBack marginBottom={0} />
      </Box>
      <Box ref={sidebarRef} className={styles.scrollArea} paddingBottom={4}>
        {subNavItems && subNavItems.length > 0 && (
          <Box
            borderRadius="large"
            background="blue100"
            className={styles.navGutter}
          >
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
              singleAccordion
              titleIcon={activeParent?.icon}
            />
          </Box>
        )}
        {sidebarFooter}
        <Box
          className={cn(styles.scrollShadowBottom, {
            [styles.scrollShadowVisible]: !atBottom,
          })}
        />
      </Box>
    </>
  )

  /* Takeover routes render without the layout chrome at phone widths:
  no breadcrumbs, mobile sub-nav or footer — the screen is expected to
  provide its own back navigation. */
  const showMobileNav =
    !isMobileTakeover && isMobile && !!subNavItems && subNavItems.length > 0

  // Stuck once the sentinel has scrolled up past the menu's sticky line
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) {
      setIsStuck(false)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { rootMargin: `-${stickyHeight}px 0px 0px 0px` },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [stickyHeight, showMobileNav])

  // Rendered outside SidebarLayout so it spans the full width, free of the grid gutter
  return (
    <>
      {showMobileNav && (
        <div
          ref={sentinelRef}
          aria-hidden="true"
          className={styles.mobileNavSentinel}
          // Also clears the banners
          style={{ paddingTop: height }}
        />
      )}
      {showMobileNav && (
        <Box
          width="full"
          className={cn(styles.mobileNav, {
            [styles.mobileNavStuck]: isStuck,
          })}
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
            singleAccordion
            isMenuDialog={true}
            mobileNavigationButtonOpenLabel={formatMessage(m.seeAll)}
          />
        </Box>
      )}
      <SidebarLayout
        isSticky={true}
        sidebarContent={sidebar}
        offsetTop={height}
      >
        <Box
          as="main"
          paddingBottom={9}
          component="main"
          // The mobile nav above already clears the banners
          style={{ marginTop: showMobileNav ? 0 : height }}
        >
          {!isMobileTakeover && <ContentBreadcrumbs />}
          <ModuleAlertBannerSection />
          {children}
          {!isMobileTakeover && sidebarFooter && (
            <Hidden above="sm">{sidebarFooter}</Hidden>
          )}
        </Box>
      </SidebarLayout>
    </>
  )
}
