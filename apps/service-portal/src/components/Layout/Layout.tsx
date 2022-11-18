import React, { FC, useEffect, useState } from 'react'
import Header from '../Header/Header'
import {
  Box,
  ToastContainer,
  Navigation,
  NavigationItem,
  Hidden,
} from '@island.is/island-ui/core'
import ContentBreadcrumbs from '../../components/ContentBreadcrumbs/ContentBreadcrumbs'
import GoBack from '../../components/GoBack/GoBack'
import AuthOverlay from '../Loaders/AuthOverlay/AuthOverlay'
import useRoutes from '../../hooks/useRoutes/useRoutes'
import { useModules } from '../../hooks/useModules/useModules'
import {
  m,
  ServicePortalNavigationItem,
  ServicePortalPath,
  useScrollTopOnUpdate,
} from '@island.is/service-portal/core'
import { useLocation, matchPath } from 'react-router-dom'
import { useLocale, useNamespaces } from '@island.is/localization'
import { GlobalAlertBannerSection } from '../AlertBanners/GlobalAlertBannerSection'
import {
  GET_ORGANIZATIONS_QUERY,
  Organization,
  useAlertBanners,
} from '@island.is/service-portal/graphql'
import { useMeasure, useWindowSize } from 'react-use'
import InstitutionPanel from '../InstitutionPanel/InstitutionPanel'
import useNavigation from '../../hooks/useNavigation/useNavigation'
import { useQuery } from '@apollo/client'
import SidebarLayout from './SidebarLayout'
import Sticky from '../Sticky/Sticky'
import { theme } from '@island.is/island-ui/theme'
import { Link as ReactLink } from 'react-router-dom'

const Layout: FC = ({ children }) => {
  useRoutes()
  useModules()
  useNamespaces(['service.portal', 'global'])
  const { pathname } = useLocation()
  useScrollTopOnUpdate([pathname])
  const { formatMessage } = useLocale()
  const navigation = useNavigation()
  const [isDashboard, setIsDashboard] = useState(true)
  const banners = useAlertBanners()
  const [ref, { height }] = useMeasure()
  const globalBanners = banners.filter((banner) =>
    banner.servicePortalPaths?.includes('*'),
  )
  const { width } = useWindowSize()
  const isTablet = width <= theme.breakpoints.lg
  const subNavItems: NavigationItem[] = []

  const findParent = (navigation?: ServicePortalNavigationItem[]) => {
    // finnur active parent flokk
    return navigation?.find(
      (item) => item.path?.split('/')[1] === pathname.split('/')[1],
    )
  }

  const mapChildren = (item: ServicePortalNavigationItem): any => {
    if (item.children) {
      return {
        title: formatMessage(item.name),
        href: item.path,
        active: matchPath(pathname, {
          path: item.path,
          exact: true,
          strict: false,
        }),
        items: item.children
          .filter((x) => !x.navHide)
          .map((child) => {
            return mapChildren(child)
          }),
      }
    } else {
      return {
        title: formatMessage(item.name),
        href: item.path,
        active: pathname === item.path,
      }
    }
  }

  const parent = findParent(navigation[0]?.children)

  if (parent !== undefined) {
    // subNavItems.push({
    //   title: formatMessage(parent.name),
    //   href: parent.path,
    //   active: pathname === parent.path,
    // })
    parent.children
      ?.filter((item) => !item.navHide)
      ?.map((item: ServicePortalNavigationItem) =>
        subNavItems.push(mapChildren(item)),
      )
  }

  // Todo: Birta líka yfirlitsskjá í efnisyfiliti

  useEffect(() => {
    if (
      pathname === ServicePortalPath.MinarSidurPath + '/' ||
      pathname === ServicePortalPath.MinarSidurRoot
    ) {
      setIsDashboard(true)
    } else {
      setIsDashboard(false)
    }
  }, [pathname])

  const defaultOrg: Organization = {
    email: '',
    footerItems: [],
    id: '123',
    phone: '1234123',
    publishedMaterialSearchFilterGenericTags: [],
    shortTitle: 'Ísland.is',
    slug: 'island.is',
    tag: [],
    title: 'Stafrænt Ísland',
  }

  const { data: orgData, loading } = useQuery(GET_ORGANIZATIONS_QUERY)
  const organizations = orgData?.getOrganizations?.items || {}
  let org: Organization = defaultOrg

  if (!loading && organizations) {
    org =
      organizations.find(
        (org: Organization) => org.id === parent?.serviceProvider,
      ) ?? defaultOrg
  }

  return (
    <>
      <AuthOverlay />
      <ToastContainer useKeyframeStyles={false} />
      {globalBanners.length > 0 && (
        <GlobalAlertBannerSection ref={ref} banners={globalBanners} />
      )}
      <Header position={height ? height : 0} />
      {!isDashboard && (
        <SidebarLayout
          isSticky={false}
          sidebarContent={
            <Sticky>
              <Box>
                <GoBack />
                <Box marginBottom={3}>
                  <InstitutionPanel
                    institution={org?.title ?? ''}
                    institutionTitle={formatMessage(m.serviceProvider)}
                    locale="is"
                    linkHref={org?.link ?? ''}
                    img={org?.logo?.url ?? ''}
                    imgContainerDisplay={['block', 'block', 'none', 'block']}
                  />
                </Box>
                {subNavItems.length > 0 && (
                  <Box background="blue100">
                    <Navigation
                      renderLink={(link, item) => {
                        return item?.href ? (
                          <ReactLink to={item?.href}>{link}</ReactLink>
                        ) : (
                          link
                        )
                      }}
                      baseId={'service-portal-navigation'}
                      title={formatMessage(m.tableOfContents)}
                      items={subNavItems}
                    />
                  </Box>
                )}
              </Box>
            </Sticky>
          }
        >
          <Box as="main" component="main" style={{ marginTop: height }}>
            <ContentBreadcrumbs
              tag={{
                variant: 'purple',
                href: org?.link ?? '',
                children: org?.title ?? '',
                active: org?.link ? true : false,
              }}
            />
            {subNavItems.length > 0 && (
              <Hidden above="sm">
                <Box paddingBottom={3}>
                  <Navigation
                    renderLink={(link, item) => {
                      return item?.href ? (
                        <ReactLink to={item?.href}>{link}</ReactLink>
                      ) : (
                        link
                      )
                    }}
                    baseId={'service-portal-mobile-navigation'}
                    title={
                      parent?.name
                        ? formatMessage(parent?.name)
                        : formatMessage(m.tableOfContents)
                    }
                    items={subNavItems}
                    isMenuDialog={true}
                  />
                </Box>
              </Hidden>
            )}
            {children}
          </Box>
        </SidebarLayout>
      )}
      {isDashboard && (
        <Box as="main" component="main" style={{ marginTop: height }}>
          <ContentBreadcrumbs />
          {children}
        </Box>
      )}
    </>
  )
}
export default Layout
