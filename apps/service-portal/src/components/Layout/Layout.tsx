import React, { FC, useEffect, useState } from 'react'
import Header from '../Header/Header'
import Sidebar from '../Sidebar/Sidebar'
import {
  Box,
  Hidden,
  ToastContainer,
  GridContainer,
  GridColumn,
  GridRow,
  Navigation,
  NavigationItem,
  Button,
} from '@island.is/island-ui/core'
import ContentBreadcrumbs from '../../components/ContentBreadcrumbs/ContentBreadcrumbs'
import GoBack from '../../components/GoBack/GoBack'
import * as styles from './Layout.css'
import AuthOverlay from '../Loaders/AuthOverlay/AuthOverlay'
import useRoutes from '../../hooks/useRoutes/useRoutes'
import { useModules } from '../../hooks/useModules/useModules'
import {
  ServicePortalNavigationItem,
  ServicePortalPath,
  useScrollTopOnUpdate,
} from '@island.is/service-portal/core'
import { matchPath, useLocation } from 'react-router-dom'
import MobileMenu from '../MobileMenu/MobileMenu'
import { useLocale, useNamespaces } from '@island.is/localization'
import { useStore } from '../../store/stateProvider'
import { RemoveScroll } from 'react-remove-scroll'
import cn from 'classnames'
import { GlobalAlertBannerSection } from '../AlertBanners/GlobalAlertBannerSection'
import {
  GET_ORGANIZATIONS_QUERY,
  Organisation,
  Organization,
  useAlertBanners,
} from '@island.is/service-portal/graphql'
import { useMeasure } from 'react-use'
import InstitutionPanel from '../InstitutionPanel/InstitutionPanel'
import useNavigation from '../../hooks/useNavigation/useNavigation'
import { gql, useQuery } from '@apollo/client'
import { Query } from '@island.is/api/schema'

const GET_ORGANIZATION_QUERY = gql`
  query GetOrganization($input: GetOrganizationInput!) {
    getOrganization(input: $input) {
      id
      slug
      title
      logo {
        title
        url
      }
      link
    }
  }
`
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
        active: pathname === item.path,
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
    parent.children
      ?.filter((item) => !item.navHide)
      ?.map((item: ServicePortalNavigationItem) =>
        subNavItems.push(mapChildren(item)),
      )
  }

  // Todo: Birta líka yfirlitsskjá í efnisyfiliti
  // Todo: Recursion til að sækja öll nestuð börn (sjá breadcrumbs)
  // Todo: Ekki birta ef ekki route (t.d fasteignir, kemur bara id)
  // Todo: Ekki birta ef tómt

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
  const { data: orgData, loading, error } = useQuery(GET_ORGANIZATIONS_QUERY)
  const organizations = orgData?.getOrganizations?.items || {}
  let org: Organization = defaultOrg
  if (!loading && organizations) {
    org = organizations.find(
      (org: Organization) => org.id === parent?.serviceProvider,
    )
  }

  return (
    <>
      <AuthOverlay />
      <ToastContainer useKeyframeStyles={false} />
      {globalBanners.length > 0 && (
        <GlobalAlertBannerSection ref={ref} banners={globalBanners} />
      )}
      <Header position={height ? height : 0} />

      <Box paddingBottom={7}>
        <Box as="main" component="main" style={{ marginTop: height }}>
          <Hidden print>
            {!isDashboard && (
              <GridContainer>
                <GridRow>
                  <GridColumn span="3/12">
                    <Box>
                      <GoBack />
                      <Box marginBottom={3}>
                        <InstitutionPanel
                          institution={org?.title ?? ''}
                          institutionTitle="Þjónustuaðili"
                          locale="is"
                          linkHref={org?.link ?? ''}
                          img={org?.logo?.url ?? ''}
                        />
                      </Box>
                      {subNavItems.length > 0 && (
                        <Box background="blue100">
                          <Navigation
                            baseId={'test'}
                            title={
                              parent?.name
                                ? formatMessage(parent?.name)
                                : 'Efnisyfirlit'
                            }
                            items={subNavItems}
                          />
                        </Box>
                      )}
                    </Box>
                  </GridColumn>
                  <GridColumn span="7/12" offset="1/12">
                    <ContentBreadcrumbs />
                    {children}
                  </GridColumn>
                </GridRow>
              </GridContainer>
            )}
            {isDashboard && (
              <>
                <ContentBreadcrumbs />
                {children}
              </>
            )}
          </Hidden>
        </Box>
      </Box>
    </>
  )
}
export default Layout
