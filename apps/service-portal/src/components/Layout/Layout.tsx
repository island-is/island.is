import React, { FC, useEffect, useState } from 'react'
import Header from '../Header/Header'
import {
  Box,
  ToastContainer,
  Navigation,
  NavigationItem,
} from '@island.is/island-ui/core'
import ContentBreadcrumbs from '../../components/ContentBreadcrumbs/ContentBreadcrumbs'
import AuthOverlay from '../Loaders/AuthOverlay/AuthOverlay'
import {
  m,
  ServicePortalNavigationItem,
  useScrollTopOnUpdate,
  ModuleAlertBannerSection,
} from '@island.is/service-portal/core'
import { useLocation, matchPath } from 'react-router-dom'
import { useLocale, useNamespaces } from '@island.is/localization'
import { GlobalAlertBannerSection } from '../AlertBanners/GlobalAlertBannerSection'
import { useAlertBanners } from '@island.is/service-portal/graphql'
import { useMeasure, useWindowSize } from 'react-use'
import SidebarLayout from './SidebarLayout'
import Sticky from '../Sticky/Sticky'
import { Link as ReactLink } from 'react-router-dom'
import GoBack from '../GoBack/GoBack'
import { useDynamicRoutesWithNavigation } from '@island.is/service-portal/core'
import { MAIN_NAVIGATION } from '../../lib/masterNavigation'
import { theme } from '@island.is/island-ui/theme'
import FullWidthLayout from './FullWidthLayout'
import { fwPaths } from '../../lib/fullWidthPaths'

export const Layout: FC = ({ children }) => {
  useNamespaces(['service.portal', 'global', 'portals'])
  const { formatMessage } = useLocale()
  const { pathname } = useLocation()
  const [isFullwidth, setIsFullwidth] = useState(true)
  const [sideMenuOpen, setSideMenuOpen] = useState(false)

  const navigation = useDynamicRoutesWithNavigation(MAIN_NAVIGATION)
  const activeParent = navigation?.children?.find((item) => {
    const currentItemIsActive = item.active
    const hasActiveChild = item.children?.find((child) => child.active)
    return currentItemIsActive || hasActiveChild
  })
  useScrollTopOnUpdate([pathname])
  const banners = useAlertBanners()
  const [ref, { height }] = useMeasure()
  const globalBanners = banners.filter((banner) =>
    banner.servicePortalPaths?.includes('*'),
  )
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  const mapChildren = (item: ServicePortalNavigationItem): any => {
    if (item.children) {
      return {
        title: formatMessage(item.name),
        href: item.path,
        active: item.path && pathname.includes(item.path),
        items: item.children
          .filter((x) => !x.navHide)
          .map((child) => {
            return mapChildren(child)
          }),
        accordion: true,
      }
    } else {
      return {
        title: formatMessage(item.name),
        href: item.path,
        active: pathname === item.path,
      }
    }
  }

  const subNavItems: NavigationItem[] | undefined = activeParent?.children
    ?.filter((item) => !item.navHide)
    ?.map((item: ServicePortalNavigationItem) => {
      return mapChildren(item)
    })

  useEffect(() => {
    const matches = fwPaths.find((route) => matchPath(route, pathname))
    setIsFullwidth(!!matches)
  }, [pathname])

  return (
    <div>
      <AuthOverlay />
      <ToastContainer useKeyframeStyles={false} />
      {globalBanners.length > 0 && (
        <GlobalAlertBannerSection ref={ref} banners={globalBanners} />
      )}
      <Header
        setSideMenuOpen={(set: boolean) => setSideMenuOpen(set)}
        sideMenuOpen={sideMenuOpen}
        position={height ? height : 0}
      />

      {!isFullwidth && activeParent && (
        <SidebarLayout
          isSticky={true}
          sidebarContent={
            <Sticky>
              <Box style={{ marginTop: height }}>
                <GoBack />

                {subNavItems && subNavItems.length > 0 && (
                  <Box borderRadius="large" background="blue100">
                    <Navigation
                      renderLink={(link, item) => {
                        return item?.href ? (
                          <ReactLink to={item?.href}>{link}</ReactLink>
                        ) : (
                          link
                        )
                      }}
                      asSpan
                      baseId={'service-portal-navigation'}
                      title={formatMessage(
                        activeParent.name ?? m.tableOfContents,
                      )}
                      items={subNavItems ?? []}
                      expand
                      titleIcon={activeParent.icon}
                    />
                  </Box>
                )}
              </Box>
            </Sticky>
          }
        >
          <Box
            as="main"
            paddingBottom={9}
            component="main"
            style={{ marginTop: height }}
          >
            <ContentBreadcrumbs />
            {isMobile && subNavItems && subNavItems.length > 0 && (
              <Box paddingBottom={3} width="full">
                <Navigation
                  renderLink={(link, item) => {
                    return item?.href ? (
                      <ReactLink to={item?.href}>{link}</ReactLink>
                    ) : (
                      link
                    )
                  }}
                  asSpan
                  baseId={'service-portal-mobile-navigation'}
                  title={
                    activeParent?.name
                      ? formatMessage(activeParent?.name)
                      : formatMessage(m.tableOfContents)
                  }
                  items={subNavItems}
                  titleIcon={activeParent.icon}
                  isMenuDialog={true}
                />
              </Box>
            )}
            <ModuleAlertBannerSection />
            {children}
          </Box>
        </SidebarLayout>
      )}
      {(isFullwidth || !activeParent) && (
        <FullWidthLayout activeParent={activeParent} height={height}>
          <Box paddingTop={4} width="full">
            <ModuleAlertBannerSection />
          </Box>
          {children}
        </FullWidthLayout>
      )}
    </div>
  )
}
